# 개발 문서입니다.

## API 작성 방법

작성 방법은 다음과 같은 절차를 따릅니다. : 

1. src/services/ 에 서비스 처리를 위한 모듈을 작성합니다.
2. src/repositories/ 에 서비스 처리에 있어서 필요한 DB 관련 작업 모듈을 작성합니다.
3. src/routes/ 에 해당 서비스에 대한 라우트 정보를 작성합니다.
4. src/routes/routes.js 에 작성했던 라우트 정보를 연결해줍니다.

### API 명명 규칙

우리는 기본적으로 API URL을 리소스 기반으로 작성하기에 각 세곳에 작성할 메인 명칭도 리소스 기반으로 하길 권고합니다.

예시 : 
ranking 목록 가져오는 API

해당 API의 URL은 다음과 같습니다. : 
> game/ranking

상위 리소스가 "game"이기에 명칭을 "game"으로 지정한다고 가정하면 다음과 같은 구졸르 갖게 됩니다.

1. 서비스 : src/services/game-service.js
2. 레포지터리 : src/repositories/game-repository.js
3. 라우트 : src/routes/game-route.js


#### 서비스 Action에 대한 명명규칙

URL을 통해 관리하기에 Action에 해당하는 함수 명칭은 읽는 개발자가 이해하기 쉽도록 하는게 더 유리할 수 있습니다.
저 같은 경우는 ranking이 아닌  "TopMMR" 으로 작성해 MMR의 상위 정보를 가져온다는 의미로 작성했습니다.


## ROUTE 등록 방법

라우트에 대한 기본 정보는 "{api}-route.js"에 등록하도록 합니다.

작성 예시

```javascript
//src/routes/game-route.js
import { TopMMR } from '../services/game-service';

const routes = [
  {
    method: 'get',
    url: '/game/ranking',
    action: TopMMR,
  //authRequired: true, // 만약 인증이 필수인 경우 다음과 같이 플래그를 작성합니다.
  },
];

export default routes;
```

라우트에 대한 기본 정보 작성이 완료되었다면 route.js의 allRoute에 정보를 등록합니다.

```javascript
//src/routes/route.js
import Utils from '../lib/utils.js';
import { authenticateToken } from '../middleware/auth-middleware.js';
import { tokenVerify } from '../middleware/token-middleware.js';
import gameRoutes from './game-route.js';

const allRoutes = [
  gameRoutes, //game-route 등록
  // 다른 라우트 추가 가능
];

// 파라미터 및 미들웨어 자동 설정
allRoutes.forEach((route) => {
   //요청자가 요청시 반드시 넣어야할 데이터 셋
  route.requiredParams = Utils.getFunctionParams(route.action);

  route.middleware = [tokenVerify];

  if (route.authRequired) { //인증 필수 플래그 처리
    route.middleware.push(authenticateToken);
  }
});

export default allRoutes;
```


## Service 작성 요령
서비스는 서버가 요청에 대한 처리를 받아들이는 앞단입니다.
req, res 객체를 별도로 사용하지 못하며 사용자가 전송한 데이터를 기준으로 처리와 가공후 결과 데이터만 반환하는게 역할입니다.

우선 여기서는 game/ranking 관련된 처리를 예시로 두고 있으니 관련 DB 접근 코드를 작성합니다.

```javascript
// src/repositories/game-repository.js
import prisma from '../lib/prisma.js';

export const getTop100MMR = async () => {
  try {
    const topUsers = await prisma.MMR.findMany({
      orderBy: {
        score: 'desc',
      },
      take: 100,
      include: {
        Users: {
          select: {
            userName: true,
          },
        },
      },
    });
    return topUsers;
  } catch (error) {
    console.error('Error fetching top 100 MMR:', error);
    throw new Error('Could not fetch top 100 MMR users');
  }
};

export const getMMRByUserId = async (userId) => {
  try {
    const userMMR = await prisma.MMR.findUnique({
      where: {
        userId: userId,
      },
      include: {
        Users: {
          select: {
            userName: true,
          },
        },
      },
    });
    if (!userMMR) {
      throw new Error('MMR not found for this user');
    }
    return userMMR;
  } catch (error) {
    console.error(`Error fetching MMR for userId ${userId}:`, error);
    throw new Error('Could not fetch MMR for the given user');
  }
};
```

다음은 service입니다. : 

```javascript
//src/services/game-service.js
//작성한 db 접근 코드 불러오기
import { getTop100MMR, getMMRByUserId } from '../repositories/game-repository';

//파라미터는 객체 형태로 표현합니다.
export const TopMMR = async ({ userId = null }) => {
  let result = {};

  const promises = [getTop100MMR()];
  if (userId) {
    promises.push(getMMRByUserId(userId));
  }

  const [topMMR, userRank] = await Promise.all(promises);

//db에서 받아온 정보를 결합해 반환합니다.
  result.ranks = topMMR;
  if (userId) {
    result.userRank = userRank;
  }

  return result;
};
```


### Service의 파라미터 작성법
먼저 서비스가 처리를 위해 받아야할 파라미터는 객체 형태로 작성합니다.
``` javascript
{a, b, c}
```
이렇게 하면 자동으로 라우터 핸들러에서 제공하게 되어 있습니다.

그리고 파라미터 작성엔 추가 규칙이 있습니다.
1. 기본값이 있을 경우 요청자가 값을 제공하지 않아도 됩니다.
2. 기본값이 없을 경우 요청자가 해당 값을 제공하지 않을시 잘못된 요청에 대한 에러를 반환합니다.

아래 코드를 보면 더 이해하기 쉽습니다. : 

```javascript
export const functionName = async ({optionalParameter = null, requirementParameter}) => {
    let result;
    return result;
}

```

다음은 실제 사례입니다. : 
```javascript
//src/services/game-service.js
import { getTop100MMR, getMMRByUserId } from '../repositories/game-repository';

export const TopMMR = async ({ userId = null }) => {
  let result = {};

  const promises = [getTop100MMR()];
  if (userId) {
    promises.push(getMMRByUserId(userId));
  }

  const [topMMR, userRank] = await Promise.all(promises);

  result.ranks = topMMR;
  if (userId) {
    result.userRank = userRank;
  }

  return result;
};
```

다음 구간을 보면 userId를 null로 처리해 반드시 파라미터를 포함할 필욘 없음을 알리고 아래에서도 userId가 유효한 값일 경우에만 처리하도록 작성되어 있습니다. : 
```javascript
async ({ userId = null })
```