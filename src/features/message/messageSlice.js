import { createSlice, nanoid } from "@reduxjs/toolkit";

// Функции для работы с localStorage
const loadMessages = () => JSON.parse(localStorage.getItem("cheeky_messages")) || [];
const loadLLMMessages = () => JSON.parse(localStorage.getItem("cheeky_llm_messages")) || [];

const saveToLocalStorage = (messages, llmMessages) => {
    localStorage.setItem("cheeky_messages", JSON.stringify(messages));
    localStorage.setItem("cheeky_llm_messages", JSON.stringify(llmMessages));
};

const initialState = {
    messages: loadMessages(),
    llmMessage: loadLLMMessages(),
    sent: false
};

export const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        addMessage: (state, action) => {
            const newMessage = {
                id: nanoid(),
                message: action.payload.message,
                role: action.payload.role
            };

            state.messages.push(newMessage);
            state.llmMessage.push({ role: action.payload.role, content: action.payload.message });

            // Автоматически сохраняем в localStorage
            saveToLocalStorage(state.messages, state.llmMessage);

            if (action.payload.role === "user") {
                console.log("sent status changed");
                state.sent = !state.sent;
            }
        },
        deleteMessage: (state, action) => {
            state.messages = state.messages.filter((message) => message.id !== action.payload.id);
            state.llmMessage = state.llmMessage.filter(
                (message) => !(message.content === action.payload.message && message.role === action.payload.role)
            );

            // Автоматически обновляем localStorage
            saveToLocalStorage(state.messages, state.llmMessage);
        }
    }
});

export const { addMessage, deleteMessage } = messageSlice.actions;
export default messageSlice.reducer;
