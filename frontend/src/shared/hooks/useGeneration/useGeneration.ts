// import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../../app/store";
// import { testMarkdown } from "../../constants/testMarkdown";
// import { markdownToSlides } from "../../utils/markdownToSlides";
// import { setSlides } from "../../../app/store/slices/editorSlice";

// const API_URL = process.env.REACT_APP_API_URL;

// interface ChatMessage {
//   id: string;
//   type: "user" | "ai";
//   content: string;
//   file?: File;
// }
// export const useGeneration = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const dispatch = useDispatch<AppDispatch>();
// const [model, setModel] = useState<string>("google/gemma-3-12b-it");
//   const [fileStatus, setFileStatus] = useState<{
//     name: string;
//     converted: boolean;
//   } | null>(null);

//   useEffect(() => {
//     const mockMessages: ChatMessage[] = [
//       {
//         id: crypto.randomUUID(),
//         type: "ai",
//         content: "Привет! Я помогу тебе отредактировать твой слайд.",
//       },
//     ];
//     setMessages(mockMessages);
//   }, []);

//   const sendMessage = (): Promise<boolean> => {
//     return new Promise((resolve) => {
//       if (!inputText.trim() || !selectedFile) {
//         setError("Введите текст и прикрепите файл!");
//         resolve(false);
//         return;
//       }

//       const userMsg: ChatMessage = {
//         id: crypto.randomUUID(),
//         type: "user",
//         content: inputText,
//         file: selectedFile,
//       };
//       setMessages((prev) => [...prev, userMsg]);
//       setInputText("");
//       setFileStatus({ name: selectedFile.name, converted: false });
//       setLoading(true);

//       setTimeout(() => {
//         const aiMsg: ChatMessage = {
//           id: crypto.randomUUID(),
//           type: "ai",
//           content: "Конечно! Вот сгенерированная презентация.",
//         };
//         setMessages((prev) => [...prev, aiMsg]);
//         setFileStatus({ name: selectedFile.name, converted: true });
//         setSelectedFile(null);
//         const parsedSlides = markdownToSlides(testMarkdown);
//         dispatch(setSlides(parsedSlides));
//         if (fileInputRef.current) fileInputRef.current.value = "";
//         resolve(true);
//         setLoading(false);
//       }, 6000);
//     });
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setSelectedFile(file);
//     setFileStatus({ name: file.name, converted: true });
//   };
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     return await sendMessage();
//   };
//   return {
//     inputText,
//     setInputText,
//     messages,
//     fileInputRef,
//     fileStatus,
//     handleFileChange,
//     handleSubmit,
//     loading,
//     error,
//     setError,
//     model,
//     setModel,
//   };
// };

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { markdownToSlides } from "../../utils/markdownToSlides";
import { setSlides } from "../../../app/store/slices/editorSlice";
import { PlateSlide } from "../../types";

const API_URL = process.env.REACT_APP_API_URL;

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  file?: File;
}

export const useGeneration = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<string>("google/gemma-3-12b-it");
  const dispatch = useDispatch<AppDispatch>();

  const [fileStatus, setFileStatus] = useState<{
    name: string;
    converted: boolean;
  } | null>(null);

  useEffect(() => {
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      type: "ai",
      content: "Привет! Я помогу тебе создать презентацию по файлу.",
    };
    setMessages([aiMsg]);
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedFile) {
      setError("Введите текст и прикрепите файл!");
      return;
    }

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      type: "user",
      content: inputText,
      file: selectedFile,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setFileStatus({ name: selectedFile.name, converted: false });
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", inputText);
      formData.append("file", selectedFile);
      formData.append("model", model);

      const response = await fetch(`${API_URL}/presentation/generate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Поток недоступен в ответе");

      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        type: "ai",
        content: "",
      };

      setMessages((prev) => [...prev, aiMsg]);

      let allSlides: PlateSlide[] = [];
      let firstSlideAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        fullText += chunk;

        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsg.id ? { ...m, content: fullText } : m))
        );

        const parts = buffer.split(/^#\s+/gm);
        buffer = parts.pop() || "";

        const readySlides = parts
          .filter((p) => p.trim())
          .map((p) => "# " + p.trim());

        if (readySlides.length) {
          const markdown = readySlides.join("\n\n");
          const slidesChunk = markdownToSlides(markdown);

          allSlides = [...allSlides, ...slidesChunk];
          dispatch(setSlides(allSlides));
          if (!firstSlideAdded) {
            setLoading(false);
            firstSlideAdded = true;
          }
        }
      }

      if (buffer.trim()) {
        const slidesChunk = markdownToSlides(buffer);
        allSlides = [...allSlides, ...slidesChunk];
        dispatch(setSlides(allSlides));
      }

      setSelectedFile(null);
      setFileStatus({ name: userMsg.file!.name, converted: true });
      if (fileInputRef.current) fileInputRef.current.value = "";

      return true;
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setError("Ошибка отправки запроса");
      setFileStatus(null);
      return false;
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setFileStatus({ name: file.name, converted: true });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    return await sendMessage();
  };

  return {
    inputText,
    setInputText,
    messages,
    fileInputRef,
    fileStatus,
    handleFileChange,
    handleSubmit,
    loading,
    error,
    setError,
    model,
    setModel,
  };
};
