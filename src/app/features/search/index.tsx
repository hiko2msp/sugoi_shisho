import { ChangeEventHandler, useState } from "react";
import { replaceBackticksWithHTMLTags } from "./htmlParser";

const borderSetting = {
  borderRadius: '10px',
  borderColor: '#999',
  borderWidth: '1px',
}

const textStyle: React.CSSProperties = {
  backgroundColor: '#EEE',
  padding: '10px',
  margin: '10px',
  width: '300px',
  ...borderSetting,
}
const buttonStyle: React.CSSProperties = {
  width: '50px',
  height: '30px',
  backgroundColor: '#EEE',
  margin: '0px 10px 0px 0px',
  ...borderSetting,
}
const resetButtonStyle: React.CSSProperties = {
  width: '70px',
  height: '30px',
  backgroundColor: '#EEE',
  margin: '0px 10px 0px 0px',
  ...borderSetting,
}
const parentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center'
};
const ulStyle: React.CSSProperties = {
  margin: '5px 10px',
  padding: '5px',
}
const assistantMessageStyle: React.CSSProperties = {
  borderRadius: '5px',
  borderColor: 'gray',
  borderWidth: '2px',
  padding: '2px',
  margin: '0px 100px 1rem 0px',
  backgroundColor: '#EEEEEE',
  minHeight: '1rem',
}
const userMessageStyle: React.CSSProperties = {
  borderRadius: '5px',
  borderColor: 'gray',
  borderWidth: '2px',
  padding: '2px',
  margin: '0px 0px 1rem 100px',
  backgroundColor: '#EEEEEE',
  minHeight: '1rem',
}
async function getCurrentTabId() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab?.id;
}

type OpenAIConfig = { apiBase: string, apiKey: string, systemPrompt: string, maxTokens: number }
const getOpenAIConfig = async (): Promise<OpenAIConfig> => {
  return new Promise<OpenAIConfig>(resolve => {
    chrome.storage.sync.get(data => {
      resolve({
        apiBase: data.apiBase,
        apiKey: data.apiKey,
        systemPrompt: data.systemPrompt,
        maxTokens: data.maxTokens,
      })
    })
  })
}

const getCurrentContent = async () => {
  const tabId = await getCurrentTabId();
  if (tabId === undefined) {
    return null;
  }
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => { return document.body.innerText },
  })
  return results[0].result
}


const say = async (text: string) => {

  const { apiKey, apiBase, systemPrompt, maxTokens } = await getOpenAIConfig();
  const response = await fetch(`${apiBase}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "copilot-codex",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      max_tokens: maxTokens,
      temperature: 0.9,
    }),
  });
  const res = await response.json()
  return res.choices[0].message.content.replace('<|assistant|>', '')
}


const search = async (question: string) => {
  const content = await getCurrentContent();
  if (content === null) {
    return 'タブをActiveにしてください';
  }
  if (content.length > 3500) {
    console.log('> 3500')
    return await say(`${content.slice(0, 3500)}\n質問: ${question}\nです。日本語で回答してください`);
  } else {
    console.log('< 4000')
    return await say(`${content}\n質問: ${question}`);
  }
}

type Comment = {
  message: string;
  type: 'user' | 'assistant';
}

const Search = () => {
  const [text, setText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
    setText(event.target.value)
  }
  const onClick = () => {
    setComments((state) => [...state, { message: text, type: 'user' }, { message: '回答中...', type: 'assistant' }])
    setText('')
    setTimeout(async () => {
      const assistantMessage = await search(text);

      setComments((state) => {
        const len = state.length;
        const lastMessageIndex = state.findLastIndex(comment => comment.type === 'assistant')

        return [...state.slice(0, lastMessageIndex),
        { message: replaceBackticksWithHTMLTags(assistantMessage), type: 'assistant' },
        ...state.slice(lastMessageIndex + 1, len)]
      })
    })
  }
  const onClickReset = () => {
    setComments([])
    setText('')
  }
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = e => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <>
      <div style={parentStyle}>
        <textarea value={text} onChange={onChange} onKeyDown={handleKeyDown} style={textStyle} />
        <button onClick={onClick} style={buttonStyle}>送信</button>
        <button onClick={onClickReset} style={resetButtonStyle}>リセット</button>
      </div>
      <ul style={ulStyle}>
        {comments.map((comment, i) => <li key={i} style={comment.type === 'user' ? userMessageStyle : assistantMessageStyle}>{comment.message}</li>)}
      </ul>
    </>
  )
}

export default Search