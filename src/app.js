import env from './lib/env.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from './lib/logger.js';
import allRoutes from './routes/routes.js';
import ApiError from './errors/api-error.js';
import UsersRouter from './routes/users-route.js';
const { SERVER_PORT } = env;
const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const errorHandler = (error, req) => {
  let message = 'Internal Server Error';
  let statusCode = 500;
  if (error instanceof ApiError) {
    message = error.message;
    statusCode = error.statusCode;
  }
  logger.error(`Error occurred: ${req.url}/${req.method} => ${error}, Status Code: ${statusCode}`);
  return { message, statusCode };
};

const routeHandler = (action, requiredParams) => async (req, res) => {
  let success = true;
  let statusCode = 200;
  let message = null;
  let result = {};
  try {
    // 요청 방식에 따라 적절한 데이터를 가져옴
    const data = {
      ...{ ...req.body, ...req.params, ...req.query },
      ...req.user,
    };
    // 필수 파라미터 검증
    const missingParams = requiredParams.filter((param) => param && !`${data[param]}`.trim());

    if (missingParams.length > 0) {
      throw new ApiError(`Missing required parameters: ${missingParams.join(', ')}`, 422);
    }

    // 서비스 호출 및 결과 반환
    result = await action({ ...data });
  } catch (error) {
    success = false;
    const errorInfo = errorHandler(error, req);
    message = errorInfo.message;
    statusCode = errorInfo.statusCode;
  } finally {
    res.status(statusCode).json({ success, ...(message && { message }), ...result });
  }
};

//모든 라우팅 등록
allRoutes.forEach((api) => {
  const { method, url, action, middleware, requiredParams } = api;
  app[method](url, ...middleware, routeHandler(action, requiredParams));
});

// 에러 처리 미들웨어
app.use((error, req, res, next) => {
  const { message, statusCode } = errorHandler(error, req);
  res.status(statusCode).json({ success: false, message });
});

app.listen(SERVER_PORT, () => {
  logger.info(`Server running on port ${SERVER_PORT}`);
});
