// 문의 폼 전송이 "성공한 직후에만" 리드 이벤트를 1회 보냅니다.
// 실패했을 때 보내면 들어오지도 않은 문의가 전환으로 잡힙니다.
//
// 아래 fetch 부분은 예시입니다. 내 사이트의 기존 전송 코드는 그대로 두고,
// 성공 분기 안에 oaiq(...) 호출 한 줄만 추가하면 됩니다.
// oaiq("measure", ...) 줄은 광고 관리자 > 전환 > 전환 이벤트 > ⋯ > 코드 보기에서
// 보여주는 호출과 같아야 합니다. (기준 이벤트 "리드 생성" = lead_created)

const form = document.querySelector("#inquiry-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(new FormData(form))),
  });

  if (!res.ok) {
    // 실패: 이벤트를 보내지 않습니다.
    return;
  }

  // 성공: 픽셀이 로드된 경우에만 호출 (광고 차단 등으로 없을 수 있음)
  if (window.oaiq) {
    oaiq("measure", "lead_created", { type: "customer_action" });
  }

  form.reset();
});
