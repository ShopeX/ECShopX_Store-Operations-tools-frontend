<p align="center"><img width="600" height="auto" alt="logo1" src="logo.png" /></p>

### <p align="center">Store Operations Tools Frontend</p>

# Getting started
Node.js (current LTS) and npm are required to run the project. To be sure about the version compatibility you can enable Node's corepack.

### Node
```
Node v16.16.0
```

### Installation
```
cd ECShopX_Store-Operations-tools-frontend
npm i
```

### Configure the .env file
```shell
# Backend API Base URL
APP_BASE_URL=
```

### Cloud Deployment: Backend API Base URL

When deploying to a server or cloud host, requests fail until `APP_BASE_URL` points at your **own** backend instead of the default.

- **Which variable / file?** Set `APP_BASE_URL` in `.env`, or in `.env.local` which overrides `.env`.
- **Do I need the port?** Only when the backend is reached directly on a non-standard port — the PHP API listens on `8005` by default. Behind a domain proxied by Nginx on 80/443, omit the port.
- **Rebuild after every change.** `APP_*` variables are baked in at build time. After editing the env file you must re-run the build. Run it from the project root (where `package.json` lives); inside a container, run it in that same directory.

```shell
# Behind a domain (Nginx on 80/443) — no port needed, end with /api
APP_BASE_URL=https://your-domain.com/api
# Direct public IP on a non-standard port — include the port
APP_BASE_URL=http://1.2.3.4:8005/api

# Rebuild after changing the value
npm run build:h5   # Mobile Web App (H5)
```

### Run project 
```
npm run dev:h5
```

### Build packages 
```
npm run build:h5
```

## License
Each ECShopX source file included in this distribution is licensed under the Apache License 2.0, together with the additional terms imposed by ShopeX.

Open Software License (Apache 2.0) – Please see LICENSE.txt for the full text of the Apache 2.0 license.

每个包含在本发行版中的 ECShopX 源文件，均依据 Apache 2.0 开源许可证与ShopeX商派附加条款进行授权。

开源软件许可协议（Apache 2.0） —— 请参阅 LICENSE.txt 文件以获取 Apache 2.0 协议的完整文本。
