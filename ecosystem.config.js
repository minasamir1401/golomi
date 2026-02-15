module.exports = {
    apps: [
        {
            name: "gold-frontend",
            cwd: "./front-end",
            script: "cmd.exe",
            args: "/c npm run dev -- -p 3000",
            autorestart: true,
            restart_delay: 3000,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "development",
                PORT: 3000
            },
            error_file: "../logs/frontend-error.log",
            out_file: "../logs/frontend-out.log",
            merge_logs: true,
            time: true
        },
        {
            name: "gold-backend",
            cwd: "./Back-End",
            script: "cmd.exe",
            args: "/c venv\\Scripts\\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000",
            autorestart: true,
            min_uptime: "5s",
            max_restarts: 10,
            restart_delay: 2000,
            max_memory_restart: "1G", // 🛡️ Memory Protection
            env: {
                ENV: "production",
                PYTHONPATH: "."
            },
            error_file: "../logs/backend-error.log",
            out_file: "../logs/backend-out.log",
            merge_logs: true,
            time: true
        }
    ]
};
