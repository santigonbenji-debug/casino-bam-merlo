import * as XLSX from 'xlsx';
import { formatearFecha, formatearHora } from '../utils/dateUtils';
import { obtenerNombreGrado } from '../utils/grados';

/**
 * Agrupa y ordena personas por categoría
 */
const agruparPorCategoria = (personas) => {
  const residentes = personas.filter(p => p.categoria === 'residente');
  const coae = personas.filter(p => p.categoria === 'coae');
  const pago = personas.filter(p => p.categoria === 'pago');
  
  return [...residentes, ...coae, ...pago];
};

/**
 * Prepara datos para Excel con encabezados de categoría
 */
const prepararDatosConCategorias = (personas, fecha) => {
  const datos = [];
  const personasAgrupadas = agruparPorCategoria(personas);
  
  let categoriaActual = null;
  
  personasAgrupadas.forEach(persona => {
    // Agregar encabezado de categoría si cambia
    if (persona.categoria !== categoriaActual) {
      categoriaActual = persona.categoria;
      const nombreCategoria = 
        persona.categoria === 'residente' ? 'RESIDENTES' :
        persona.categoria === 'coae' ? 'COAE (TURNO OPERADOR)' :
        'ABONAN EN EL MOMENTO';
      
      // Fila de encabezado de categoría
      datos.push({
        'Fecha': '',
        'Categoría': `── ${nombreCategoria} ──`,
        'Grado': '',
        'Nombre': '',
        'N° ID': '',
        'Observaciones': '',
        'Hora': ''
      });
    }
    
    // Fila de datos
    datos.push({
      'Fecha': fecha,
      'Categoría': '',
      'Grado': persona.grado ? obtenerNombreGrado(persona.grado) : '-',
      'Nombre': persona.nombre,
      'N° ID': persona.numeroId || '-',
      'Observaciones': persona.observaciones || '-',
      'Hora': formatearHora(persona.horaAnotacion)
    });
  });
  
  return datos;
};

/**
 * Exporta las anotaciones de un día a Excel (MEJORADO)
 */
export const exportarDiaExcel = (fecha, almuerzo, cena) => {
  // Preparar datos agrupados por categoría
  const datosAlmuerzo = prepararDatosConCategorias(almuerzo, fecha);
  const datosCena = prepararDatosConCategorias(cena, fecha);

  // Crear libro de Excel
  const wb = XLSX.utils.book_new();

  // Hoja 1: Almuerzo
  const wsAlmuerzo = XLSX.utils.json_to_sheet(datosAlmuerzo);
  
  // Ajustar anchos de columnas
  wsAlmuerzo['!cols'] = [
    { wch: 12 }, // Fecha
    { wch: 30 }, // Categoría
    { wch: 22 }, // Grado
    { wch: 25 }, // Nombre
    { wch: 10 }, // N° ID
    { wch: 30 }, // Observaciones
    { wch: 10 }  // Hora
  ];
  
  XLSX.utils.book_append_sheet(wb, wsAlmuerzo, 'Almuerzo');

  // Hoja 2: Cena
  const wsCena = XLSX.utils.json_to_sheet(datosCena);
  wsCena['!cols'] = [
    { wch: 12 },
    { wch: 30 },
    { wch: 22 },
    { wch: 25 },
    { wch: 10 },
    { wch: 30 },
    { wch: 10 }
  ];
  XLSX.utils.book_append_sheet(wb, wsCena, 'Cena');

  // Hoja 3: Resumen por categoría
  const resumenAlmuerzo = {
    'Comida': 'Almuerzo',
    'Residentes': almuerzo.filter(p => p.categoria === 'residente').length,
    'COAE': almuerzo.filter(p => p.categoria === 'coae').length,
    'Abonan': almuerzo.filter(p => p.categoria === 'pago').length,
    'Total': almuerzo.length
  };
  
  const resumenCena = {
    'Comida': 'Cena',
    'Residentes': cena.filter(p => p.categoria === 'residente').length,
    'COAE': cena.filter(p => p.categoria === 'coae').length,
    'Abonan': cena.filter(p => p.categoria === 'pago').length,
    'Total': cena.length
  };
  
  const resumenTotal = {
    'Comida': 'TOTAL',
    'Residentes': resumenAlmuerzo.Residentes + resumenCena.Residentes,
    'COAE': resumenAlmuerzo.COAE + resumenCena.COAE,
    'Abonan': resumenAlmuerzo.Abonan + resumenCena.Abonan,
    'Total': almuerzo.length + cena.length
  };

  const wsResumen = XLSX.utils.json_to_sheet([resumenAlmuerzo, resumenCena, resumenTotal]);
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

  // Descargar archivo
  XLSX.writeFile(wb, `Racionamiento_${fecha}.xlsx`);
};

/**
 * Exporta el historial de un mes completo a Excel
 */
export const exportarMesExcel = async (mes, diasData) => {
  // Preparar datos del resumen mensual
  const resumenMensual = diasData.map(dia => ({
    'Fecha': dia.fecha,
    'Almuerzos': dia.almuerzos,
    'Cenas': dia.cenas,
    'Total Día': dia.total
  }));

  // Calcular totales
  const totales = {
    'Fecha': 'TOTAL',
    'Almuerzos': diasData.reduce((sum, dia) => sum + dia.almuerzos, 0),
    'Cenas': diasData.reduce((sum, dia) => sum + dia.cenas, 0),
    'Total Día': diasData.reduce((sum, dia) => sum + dia.total, 0)
  };

  resumenMensual.push(totales);

  // Crear libro de Excel
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(resumenMensual);
  XLSX.utils.book_append_sheet(wb, ws, 'Resumen Mensual');

  // Descargar archivo
  XLSX.writeFile(wb, `Historial_${mes}.xlsx`);
};

/**
 * Exporta estadísticas detalladas por categoría
 */
export const exportarEstadisticasDetalladas = (fecha, estadisticas) => {
  const datosEstadisticas = [
    {
      'Tipo': 'Almuerzo',
      'Residentes': estadisticas.almuerzos.residentes,
      'COAE': estadisticas.almuerzos.coae,
      'Pago': estadisticas.almuerzos.pago,
      'Total': estadisticas.almuerzos.total
    },
    {
      'Tipo': 'Cena',
      'Residentes': estadisticas.cenas.residentes,
      'COAE': estadisticas.cenas.coae,
      'Pago': estadisticas.cenas.pago,
      'Total': estadisticas.cenas.total
    },
    {
      'Tipo': 'TOTAL',
      'Residentes': estadisticas.almuerzos.residentes + estadisticas.cenas.residentes,
      'COAE': estadisticas.almuerzos.coae + estadisticas.cenas.coae,
      'Pago': estadisticas.almuerzos.pago + estadisticas.cenas.pago,
      'Total': estadisticas.almuerzos.total + estadisticas.cenas.total
    }
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(datosEstadisticas);
  XLSX.utils.book_append_sheet(wb, ws, 'Estadísticas');

  XLSX.writeFile(wb, `Estadisticas_${fecha}.xlsx`);
};