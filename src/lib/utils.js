import NoInstance from '../design-patterns/no-instance.js';
import env from './env.js';

const { SECURITY_PEPPER } = env;

class Utils extends NoInstance {
  /**
   * 함수의 파라미터 목록을 반환하는 함수입니다.
   * 기본값이 지정된 파라미터는 제외됩니다.
   * @param {Function} fn - 파라미터를 가져올 함수
   * @returns {string[]} - 파라미터 이름의 배열
   */
  static getFunctionParams = (fn) => {
    const fnStr = fn.toString();
    const paramMatch = fnStr.match(/\(([^)]*)\)/);

    if (!paramMatch) {
      return [];
    }

    // 중괄호 및 불필요한 공백 제거, 기본값이 지정된 파라미터 제외
    return paramMatch[1]
      .replace(/[{}]/g, '') // 중괄호 제거
      .split(',') // 콤마로 나누기
      .map((param) => param.trim()) // 공백 제거
      .filter((param) => !param.includes('=')); // 기본값이 있는 파라미터 제외
  };

  /**
   * 비밀번호에 후추를 추가하는 함수입니다.
   * 후추는 보안을 강화하기 위해 추가되는 문자열입니다.
   * @param {string} password - 원본 비밀번호
   * @returns {string} - 후추가 추가된 비밀번호
   */
  static getPepperedPassword = (password) => {
    return `${password}${SECURITY_PEPPER}`;
  };

  /**
   * 유저 이름이 규칙에 맞는지 검사하는 함수입니다.
   * 유저 이름은 최소 5자 이상의 알파벳 또는 숫자로 구성되어야 합니다.
   * @param {string} username - 검사할 유저 이름
   * @returns {boolean} - 규칙에 맞으면 true, 아니면 false
   */
  static testUsername = (username) => /^[a-zA-Z0-9]{5,}$/.test(username);

  /**
   * 유저 비밀번호가 규칙에 맞는지 검사하는 함수입니다.
   * 비밀번호는 최소 6자 이상이어야 하며, 알파벳, 숫자, 특수문자를 포함해야 합니다.
   * @param {string} password - 검사할 비밀번호
   * @returns {boolean} - 규칙에 맞으면 true, 아니면 false
   */
  static testPassword = (password) =>
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{6,}$/.test(password);

  /**
   * 유저 닉네임이 규칙에 맞는지 검사하는 함수입니다.
   * 한글은 최대 16자, 알파벳과 숫자는 최대 32자로 이루어져야 하며,
   * 특수문자는 포함되지 않아야 합니다.
   * @param {string} nickname - 검사할 닉네임
   * @returns {boolean} - 규칙에 맞으면 true, 아니면 false
   */
  static testNickname = (nickname) =>
    /^(?=.*[가-힣])([가-힣a-zA-Z0-9]{1,16})$|^[a-zA-Z0-9]{1,32}$/.test(nickname);

  /**  가중치 기반 랜덤 선택 함수*/
  static getWeightedRandomAthletes = (athletesData) => {
    const totalWeight = athletesData.reduce((sum, athlete) => sum + athlete.spawnRate, 0);
    let random = Math.random() * totalWeight;

    for (const athlete of athletesData) {
      if (random < athlete.spawnRate) {
        return athlete;
      }
      random -= athlete.spawnRate;
    }
  };

  /**
   * 0과 1 사이의 무작위 수를 반환합니다.
   * @returns {number} 무작위 수
   */
  static Random01() {
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = randomBytes.readUInt32BE(0);
    return randomNumber / 0xffffffff;
  }

  /**
   * 주어진 범위 내에서 무작위 수를 반환합니다.
   * @param {number} [min=Number.MIN_VALUE] 최소값
   * @param {number} [max=Number.MAX_VALUE] 최대값
   * @returns {number} 무작위 수
   */
  static RandomRange(min = Number.MIN_VALUE, max = Number.MAX_VALUE) {
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    return this.Random01() * (max - min) + min;
  }

  /**
   * 주어진 범위 내에서 무작위 정수를 반환합니다.
   * @param {number} [min=Number.MIN_VALUE] 최소값
   * @param {number} [max=Number.MAX_VALUE] 최대값
   * @returns {number} 무작위 정수
   */
  static RandomRangeInt(min = Number.MIN_VALUE, max = Number.MAX_VALUE) {
    return this.Floor(this.RandomRange(min, max));
  }
}

export default Utils;
