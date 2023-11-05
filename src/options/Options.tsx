import { FocusEventHandler, useEffect, useState } from "react";

const statusMessageStyle: React.CSSProperties = {
  width: '30%',
  height: '100%',
  backgroundColor: '#EEE',
  borderColor: '#999',
  borderWidth: '2px',
  borderRadius: '5px',
  fontSize: '15px',
  margin: '10px',
  padding: '5px',
}
const inputStyle: React.CSSProperties = {
  width: '400px',
  backgroundColor: '#EEE',
  borderWidth: '1px',
  borderColor: 'lightgray',
  margin: '10px',
}
const buttonStyle: React.CSSProperties = {
  backgroundColor: '#DDD',
  padding: '0px 10px',
  borderRadius: '3px',
}

const defaultConfig = {
  apiKey: '',
  apiBase: 'https://api.openai.com/v1/',
  systemPrompt: 'あなたは有能なAIです。以下の文章を読んだ上で質問に答えてください。これは私のキャリアにとても重要です。',
  maxTokens: 128,
}

type StatusMessage = {
  type: 'success' | 'error' | 'none';
  message?: string;
}


const Options = () => {
  const [apiKey, setApiKey] = useState(defaultConfig.apiKey);
  const [apiBase, setApiBase] = useState(defaultConfig.apiBase);
  const [systemPrompt, setSystemPrompt] = useState(defaultConfig.systemPrompt);
  const [maxTokens, setMaxTokens] = useState(defaultConfig.maxTokens);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ type: 'none' });
  const onChangeAPIKey: FocusEventHandler<HTMLInputElement> = (value) => {
    setApiKey(value.target.value)
  }
  const onChangeAPIBase: FocusEventHandler<HTMLInputElement> = (value) => {
    setApiBase(value.target.value)
  }
  const onChangeSystemPrompt: FocusEventHandler<HTMLTextAreaElement> = (value) => {
    setApiBase(value.target.value)
  }
  const onChangeMaxTokens: FocusEventHandler<HTMLInputElement> = (value) => {
    try {
      const num = parseInt(value.target.value, 10);
      setMaxTokens(num)
      setStatusMessage({ type: 'none' })
    } catch (e) {
      setStatusMessage({ type: 'error' as const, message: 'maxTokensが正しくありません' })
    }
  }
  const onButtonClick = () => {
    chrome.storage.sync.set({ apiKey, apiBase, systemPrompt }, () => {
      setStatusMessage({ type: 'success', message: '保存しました' })
    })
  }

  useEffect(() => {
    chrome.storage.sync.get((data) => {
      setApiKey(data.apiKey ?? defaultConfig.apiKey)
      setApiBase(data.apiBase ?? defaultConfig.apiBase)
      setSystemPrompt(data.systemPrompt ?? defaultConfig.systemPrompt)
      setSystemPrompt(data.maxTokens ?? defaultConfig.maxTokens)
    })
  }, []);

  // 簡易的なトースト設定。3秒経ったらメッセージを消す
  useEffect(() => {
    if (statusMessage.type === 'none') return;
    setTimeout(() => {
      setStatusMessage({ type: 'none' })
    }, 3000);
  }, [statusMessage])

  return (
    <div className="flex flex-col items-center">
      <h1 style={{ fontSize: '20px' }}>設定</h1>
      <div>
        <label htmlFor="apiKey">APIKey:</label>
        <input id="apiKey" placeholder={'sk-xxxxxxxx'} value={apiKey} onChange={onChangeAPIKey} style={inputStyle} />
      </div>
      <div>
        <label htmlFor="apiBase">APIBase:</label>
        <input id="apiBase" placeholder={'https://api.openai.com/v1/'} value={apiBase} onChange={onChangeAPIBase} style={inputStyle} />
      </div>
      <div className="flex items-center">
        <label htmlFor="systemPrompt">システムプロンプト:</label>
        <textarea id="systemPrompt" placeholder={'システムのプロンプトを書いてください'} defaultValue={systemPrompt} onChange={onChangeSystemPrompt} style={inputStyle} />
      </div>
      <div>
        <label htmlFor="maxTokens">maxTolens:</label>
        <input id="maxTokens" type="number" placeholder={'1 ~ 1024の数値を入力してください'} value={maxTokens} onChange={onChangeMaxTokens} style={inputStyle} min="1" max="1024" />
      </div>
      <button onClick={onButtonClick} style={buttonStyle}>保存</button>
      <div style={statusMessage.type === 'error' ? { color: 'red', ...statusMessageStyle } : statusMessage.type === 'success' ? { color: 'green', ...statusMessageStyle } : {}}>
        {statusMessage.type !== 'none' ? statusMessage.message : null}
      </div>
    </div>
  );
};

export default Options;
