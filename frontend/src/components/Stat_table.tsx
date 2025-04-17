import {
  Bar,
  Pie,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const PlayerStatsTable = () => {
  const headers = ['Competition', 'Test', 'ODI', 'T20I', 'FC'];
  const rows = [
    ['Matches', 114, 228, 78, 141],
    ['Runs scored', '8,765', '9,577', '1,672', '10,689'],
    ['Batting average', 50.66, 53.5, 26.12, 49.71],
    ['100s/50s', '22/46', '25/53', '0/10', '25/60'],
    ['Top score', '278*', '176', '79*', '278*'],
    ['Balls bowled', 204, 192, '–', 234],
    ['Wickets', 2, 7, '–', 2],
    ['Bowling average', 52.0, 28.85, '–', 69.0],
    ['5 wickets in innings', 0, 0, '–', 0],
    ['10 wickets in match', 0, 0, '–', 0],
    ['Best bowling', '2/49', '2/15', '–', '2/49'],
    ['Catches/stumpings', '222/5', '176/5', '65/7', '275/6'],
  ];

  const formatLabels = headers.slice(1); // ['Test', 'ODI', 'T20I', 'FC']

  const runsScored = rows[1].slice(1).map((val) => parseInt(val.replace(/,/g, '')));
  const matches = rows[0].slice(1).map(Number);

  // Extract wickets and filter out non-numeric values
  const wickets = rows[6].slice(1).map((val) => (isNaN(val) ? 0 : Number(val)));

  const barChartData = {
    labels: formatLabels,
    datasets: [
      {
        label: 'Runs Scored',
        data: runsScored,
        backgroundColor: [
          '#9c27b0',  // Deep purple (your original purple)
          '#ba68c8',  // Medium purple
          '#8e24aa',  // Rich purple
          '#673ab7',  // Purple-blue
        ]
      },
    ],
  };

  const bowlingBarChartData = {
    labels: formatLabels,
    datasets: [
      {
        label: 'Wickets Taken',
        data: wickets,
        backgroundColor: [
          '#9c27b0',  // Deep purple (your original purple)
          '#ba68c8',  // Medium purple
          '#8e24aa',  // Rich purple
          '#673ab7',  // Purple-blue
        ]
      },
    ],
  };

  const pieChartData = {
    labels: formatLabels,
    datasets: [
      {
        label: 'Matches Played',
        data: matches,
        backgroundColor: [
          '#9c27b0',  // Deep purple (your original purple)
          '#ba68c8',  // Medium purple
          '#8e24aa',  // Rich purple
          '#673ab7',  // Purple-blue
        ],
        hoverOffset: 4,
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white' // This makes the legend labels white
        }
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '100%', overflowX: 'auto', overflow: 'scroll', height: '100vh' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
        Cricket Player Career Stats
      </h2>

      {/* Table */}
      <table className="table-auto w-full border border-gray-300 text-black mb-10">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                style={{
                  border: '1px solid #ccc',
                  padding: '8px',
                  backgroundColor: '#f0f0f0',
                  fontWeight: 'bold',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              style={{
                backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f9f9f9',
              }}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    textAlign: 'left',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Left column with stacked bar charts */}
  <div className="flex flex-col space-y-8">
    <div>
      <h3 className="text-center text-lg font-semibold mb-2">Runs Scored (Bar Chart)</h3>
      <Bar data={barChartData} />
    </div>

    <div>
      <h3 className="text-center text-lg font-semibold mb-2">Wickets Taken (Bar Chart)</h3>
      <Bar data={bowlingBarChartData} />
    </div>
  </div>

  {/* Right column with pie chart */}
  <div className="flex items-center justify-center">
    <div>
      <h3 className="text-center text-lg font-semibold mb-2">Matches Played (Pie Chart)</h3>
      <Pie data={pieChartData} options={pieChartOptions}/>
    </div>
  </div>
</div>
    </div>
  );
};

export default PlayerStatsTable;
