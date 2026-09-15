import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const HealthTrend = ({ history }) => {
  const data = history.map((snapshot) => ({
    date: new Date(snapshot.createdAt).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric"
      }
    ),
    score: snapshot.overallScore
  }));

  return (
    <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          Health Trend
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Repository health over previous analyses.
        </p>
      </div>

      {data.length < 2 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950">
          <div className="text-center">
            <p className="text-sm font-medium text-zinc-400">
              Not enough history yet
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Analyze this repository again to build a health trend.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
              />

              <XAxis
                dataKey="date"
                stroke="#71717a"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                domain={[0, 100]}
                stroke="#71717a"
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "12px",
                  color: "#fff"
                }}
                labelStyle={{
                  color: "#a1a1aa"
                }}
              />

              <Line
                type="monotone"
                dataKey="score"
                strokeWidth={3}
                stroke="#ffffff"
                dot={{
                  r: 4,
                  fill: "#ffffff"
                }}
                activeDot={{
                  r: 6
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default HealthTrend;