export function showZendeskWidget(zendesk: any, toggleChat: () => void) {
  toggleChat();

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.onload = () => {
    if (window.$zopim) {
      window.$zopim.livechat.window.show();
      window.$zopim.livechat.setNotes(`visitor language: ${zendesk.language}`);
      window.$zopim.livechat.departments.setVisitorDepartment(zendesk.department);
      window.$zopim.livechat.setOnConnected((
        () => window.$zopim.livechat.say(zendesk.transcriptUrl))
      );
    }
  };
  script.src = `https://v2.zopim.com/?${zendesk.accountKey}`;
  document.head.appendChild(script);
}
