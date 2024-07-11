module.exports = {
    key: process.env.APP_KEY,
    prefix: "admin",
    cookie_name: "admin_auth_token",
    ignore_path: ["/admin/auth/.*"],
    permissions: {
        admin: [
            {
                "path": "/admin.*",
                "methods": "GET,POST,DELETE",
            }
        ]
    }
}