import { FocusEventHandler, useEffect, useState } from "react";

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
}


const Options = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiBase, setApiBase] = useState('https://api.openai.com/v1/');
  const [systemPrompt, setSystemPrompt] = useState('');
  const onChangeAPIKey: FocusEventHandler<HTMLInputElement> = (value) => {
    setApiKey(value.target.value)
  }
  const onChangeAPIBase: FocusEventHandler<HTMLInputElement> = (value) => {
    setApiBase(value.target.value)
  }
  const onChangeSystemPrompt: FocusEventHandler<HTMLTextAreaElement> = (value) => {
    setApiBase(value.target.value)
  }
  const onButtonClick = () => {
    chrome.storage.sync.set({ apiKey, apiBase, systemPrompt }, () => {
      console.log('設定を保存しました')
    })
  }

  useEffect(() => {
    chrome.storage.sync.get((data) => {
      setApiKey(data.apiKey ?? defaultConfig.apiKey)
      setApiBase(data.apiBase ?? defaultConfig.apiBase)
      setSystemPrompt(data.systemPrompt ?? defaultConfig.systemPrompt)
    })

  }, []);
  return (
    <div className="flex flex-col items-center">
      <h1>Options</h1>
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
      <button onClick={onButtonClick} style={buttonStyle}>保存</button>
    </div>
  );
};

export default Options;
