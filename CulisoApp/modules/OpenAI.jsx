import axios from 'axios';
import Config from 'react-native-config';

const API_KEY = Config.API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const getChatResponse = async (messages) => {
    console.log(API_KEY);
    const role = messages.role;
    const content = messages.content;
    const message = [{role, content}];
    try {
        const response = await axios.post(
            API_URL,
            {
                model: 'gpt-4o', // 사용할 모델
                messages: message, // 메시지 배열 (역할, 콘텐츠)
                max_tokens: 1500, // 응답의 최대 길이
            },
            {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error fetching chat response:', error);
        throw new Error('Failed to fetch chat response');
    }
};
