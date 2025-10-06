export default function StatsCard({ title, value, icon, gradient }) {
    return (
        <div
            className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 text-black shadow-2xl shadow-gray-500 transform hover:scale-105 transition-all duration-300`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium opacity-90">{title}</h3>
                    <p className="text-4xl font-bold mt-2">{value}</p>
                </div>
                <div className="text-5xl opacity-80" aria-hidden="true">
                    {icon}
                </div>
            </div>
        </div>
    );
}
