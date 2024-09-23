import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'This is the API documentation for the project',
  },
  servers: [
    {
      url: 'http://localhost:3000', // 실제 서비스 URL에 맞게 수정
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/services/*.js'], // API 경로에 맞게 수정
};

// swagger-jsdoc로 Swagger 문서 생성
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
