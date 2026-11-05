import "dotenv/config";

import connectDatabase from "./db/connectDatabase.js";
import startServer from "./server.js";
import { ensureDemoContent } from "./services/demoSeed.service.js";

const bootstrap = async () => {
    await connectDatabase();
    await ensureDemoContent();
    startServer()
}

bootstrap();