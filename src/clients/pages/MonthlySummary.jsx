/**
 * @description Pagina de resumen mensual de ventas (Dashboard).
 * Muestra KPIs (ingresos, gastos, beneficio neto, operaciones, ticket medio),
 * grafico de barras de beneficios/gastos mensuales, grafico circular de metodos de pago
 * y tabla comparativa entre la temporada actual y la anterior.
 * Permite seleccionar la temporada a visualizar.
 * Solo accesible para usuarios administradores.
 * @returns {JSX.Element} Dashboard con graficos y KPIs de ventas
 */
import { useEffect, useState, useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  Title,
} from 'chart.js';
import clientsApi from '../../api/clientsApi';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, Title);

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const formatMonth = (yyyymm) => {
  const [year, month] = yyyymm.split('-');
  return `${MESES[parseInt(month) - 1]} ${year}`;
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const formatPercent = (value) => {
  if (value === null || !isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

const calcDiff = (current, previous) => {
  if (!previous || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
};

export const MonthlySummary = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [summary, setSummary] = useState([]);
  const [methodSummary, setMethodSummary] = useState([]);
  const [prevSummary, setPrevSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar temporadas disponibles
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const { data } = await clientsApi.get('/productclient/summary/seasons');
        if (data.ok) {
          setSeasons(data.seasons);
          setSelectedSeason(data.current);
        }
      } catch (err) {
        console.error('Error fetching seasons:', err);
        setError('Error cargando temporadas');
      }
    };
    fetchSeasons();
  }, []);

  // Cargar datos cuando cambia la temporada seleccionada
  useEffect(() => {
    if (!selectedSeason || seasons.length === 0) return;

    const season = seasons.find((s) => s.label === selectedSeason);
    if (!season) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = `startDate=${season.startDate}&endDate=${season.endDate}`;

        // Buscar temporada anterior
        const idx = seasons.indexOf(season);
        const prevSeason = idx < seasons.length - 1 ? seasons[idx + 1] : null;
        const prevParams = prevSeason
          ? `startDate=${prevSeason.startDate}&endDate=${prevSeason.endDate}`
          : null;

        const requests = [
          clientsApi.get(`/productclient/summary/monthly?${params}`),
          clientsApi.get(`/productclient/summary/payment-method?${params}`),
        ];

        if (prevParams) {
          requests.push(clientsApi.get(`/productclient/summary/monthly?${prevParams}`));
        }

        const results = await Promise.all(requests);

        setSummary(results[0].data?.summary || []);
        setMethodSummary(results[1].data?.summary || []);
        setPrevSummary(results[2]?.data?.summary || []);
      } catch (err) {
        console.error('Error fetching summaries:', err);
        setError('Error cargando resumen mensual');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSeason, seasons]);

  // KPIs calculados
  const kpis = useMemo(() => {
    const totalIncome = summary.reduce((acc, s) => acc + (s.totalIncome || 0), 0);
    const totalExpenses = summary.reduce((acc, s) => acc + (s.totalExpenses || 0), 0);
    const totalNet = totalIncome - totalExpenses;
    const totalOps = summary.reduce((acc, s) => acc + (s.count || 0), 0);
    const ticketMedio = totalOps > 0 ? totalNet / totalOps : 0;
    return { totalIncome, totalExpenses, totalNet, totalOps, ticketMedio };
  }, [summary]);

  // KPIs temporada anterior
  const prevKpis = useMemo(() => {
    const totalIncome = prevSummary.reduce((acc, s) => acc + (s.totalIncome || 0), 0);
    const totalExpenses = prevSummary.reduce((acc, s) => acc + (s.totalExpenses || 0), 0);
    const totalNet = totalIncome - totalExpenses;
    const totalOps = prevSummary.reduce((acc, s) => acc + (s.count || 0), 0);
    const ticketMedio = totalOps > 0 ? totalNet / totalOps : 0;
    return { totalIncome, totalExpenses, totalNet, totalOps, ticketMedio };
  }, [prevSummary]);

  // Bar chart
  const barData = {
    labels: summary.map((s) => formatMonth(s._id)),
    datasets: [
      {
        label: 'Beneficios (€)',
        data: summary.map((s) => Number((s.totalIncome || 0).toFixed(2))),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Gastos (€)',
        data: summary.map((s) => Number((s.totalExpenses || 0).toFixed(2))),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Beneficios y Gastos Mensuales' },
    },
  };

  // Pie chart
  const pieData = {
    labels: methodSummary.map((m) => m._id === 'efectivo' ? 'Efectivo' : 'Tarjeta'),
    datasets: [
      {
        data: methodSummary.map((m) => Number((m.totalIncome || 0).toFixed(2))),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8ED1FC', '#AA88DD'],
      },
    ],
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <div className="m-5 fade-in">

        {/* Header + selector de temporada */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h1 className="mb-0">Resumen de Ventas</h1>
          {seasons.length > 0 && (
            <div className="d-flex align-items-center gap-2">
              <label className="fw-semibold mb-0">Temporada:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={selectedSeason || ''}
                onChange={(e) => setSelectedSeason(e.target.value)}
              >
                {seasons.map((s) => (
                  <option key={s.label} value={s.label}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading && <p>Cargando resumen...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && summary.length === 0 && <p>No hay datos de ventas para esta temporada.</p>}

        {!loading && !error && summary.length > 0 && (
          <>
            {/* KPI Cards */}
            <div className="row g-3 mb-4">
              {[
                { title: 'Ingresos', value: kpis.totalIncome, color: 'primary' },
                { title: 'Gastos', value: kpis.totalExpenses, color: 'danger' },
                { title: 'Beneficio Neto', value: kpis.totalNet, color: 'success' },
                { title: 'Operaciones', value: kpis.totalOps, color: 'info', plain: true },
                { title: 'Ticket Medio', value: kpis.ticketMedio, color: 'secondary' },
              ].map(({ title, value, color, plain }) => (
                <div className="col" key={title}>
                  <div className={`card border-${color} h-100`}>
                    <div className="card-body text-center py-3">
                      <h6 className={`card-subtitle text-${color} mb-1`}>{title}</h6>
                      <h4 className="card-title mb-0 fw-bold">
                        {plain ? value.toLocaleString('es-ES') : formatCurrency(value)}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Graficos */}
            <div className="d-flex flex-wrap gap-4 align-items-start">
              <div className="mb-5 me-3" style={{ width: 'min(100%, 650px)' }}>
                <div style={{ height: 340 }}>
                  <Bar data={barData} options={barOptions} height={340} />
                </div>
              </div>
              {methodSummary.length > 0 && (
                <div className="mb-5 ms-3" style={{ width: 'min(100%, 400px)' }}>
                  <h5 className="text-center">Metodo de pago</h5>
                  <div style={{ height: 280 }}>
                    <Pie
                      data={pieData}
                      options={{ maintainAspectRatio: false, responsive: true }}
                      height={280}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Comparativa con temporada anterior */}
            {prevSummary.length > 0 && (
              <div className="mt-2 mb-5">
                <h5>
                  Comparativa: {selectedSeason} vs{' '}
                  {seasons[seasons.findIndex((s) => s.label === selectedSeason) + 1]?.label}
                </h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Concepto</th>
                        <th className="text-end">Temporada actual</th>
                        <th className="text-end">Temporada anterior</th>
                        <th className="text-end">Diferencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Ingresos', curr: kpis.totalIncome, prev: prevKpis.totalIncome },
                        { label: 'Gastos', curr: kpis.totalExpenses, prev: prevKpis.totalExpenses, invert: true },
                        { label: 'Beneficio Neto', curr: kpis.totalNet, prev: prevKpis.totalNet },
                        { label: 'Operaciones', curr: kpis.totalOps, prev: prevKpis.totalOps, plain: true },
                        { label: 'Ticket Medio', curr: kpis.ticketMedio, prev: prevKpis.ticketMedio },
                      ].map(({ label, curr, prev, plain, invert }) => {
                        const diff = calcDiff(curr, prev);
                        const isPositive = invert ? diff !== null && diff < 0 : diff !== null && diff > 0;
                        const isNegative = invert ? diff !== null && diff > 0 : diff !== null && diff < 0;
                        return (
                          <tr key={label}>
                            <td className="fw-semibold">{label}</td>
                            <td className="text-end">
                              {plain ? curr.toLocaleString('es-ES') : formatCurrency(curr)}
                            </td>
                            <td className="text-end">
                              {plain ? prev.toLocaleString('es-ES') : formatCurrency(prev)}
                            </td>
                            <td className={`text-end fw-bold ${isPositive ? 'text-success' : ''} ${isNegative ? 'text-danger' : ''}`}>
                              {formatPercent(diff)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MonthlySummary;
