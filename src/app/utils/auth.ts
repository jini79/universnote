export interface User {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
}

// Google 로그인 시작 (페이지 전환 방식)
export function signInWithGoogle(): void {
  const domain = "ap-northeast-2tm3dta7n0.auth.ap-northeast-2.amazoncognito.com";
  const clientId = "59ol2p25jjbe1gvl6c8g4s6vh4";
  const redirectUri = "http://localhost:3000/callback";
  const scope = encodeURIComponent("openid email profile");  // 이메일 포함된 scope
  const responseType = "token"; // Implicit Flow
  const state = "random_state_" + Date.now();

  const url =
    `https://${domain}/oauth2/authorize` +
    `?response_type=${responseType}` +
    `&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&identity_provider=Google` +
    `&scope=${scope}` +
    `&state=${state}`;

  window.location.href = url;
}

// URL 해시에서 토큰 파싱
export function parseCognitoHash(): Record<string, string> {
  if (!window.location.hash) return {};
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((acc: Record<string, string>, cur) => {
      const [key, value] = cur.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

// 토큰에서 유저 정보 반환
export async function getAuthUser(): Promise<User | null> {
  const storedIdToken = localStorage.getItem("idToken");
  const storedEmail = localStorage.getItem("userEmail");

  if (storedIdToken && storedEmail) {
    const payload = JSON.parse(atob(storedIdToken.split(".")[1]));
    return {
      uid: payload.sub,
      email: storedEmail,
      name: payload.name,
      picture: payload.picture,
    };
  }

  const { id_token } = parseCognitoHash();
  if (!id_token) return null;

  const payload = JSON.parse(atob(id_token.split(".")[1]));
  console.log("Payload from token:", payload); // 꼭 확인

  // 이메일 우선순위: payload.email 또는 identities 배열에서 찾아보기
  let email = payload.email;

  if (!email && Array.isArray(payload.identities) && payload.identities.length > 0) {
    email = payload.identities[0].userEmail || payload.identities[0].email || null;
  }

  // 이메일이 없으면 @email.com으로 강제로 설정
  if (!email) {
    email = "user@email.com";
  }

  if (email) {
    localStorage.setItem("userEmail", email);
  }
  localStorage.setItem("idToken", id_token);

  return {
    uid: payload.sub,
    email: email,
    name: payload.name,
    picture: payload.picture,
  };
}
