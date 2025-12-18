import React, { useState } from 'react'
import Select from 'react-select';
import { HiSun, HiMoon } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = ({ isDark, setIsDark }) => {

  // ✅ Fixed typos in options
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Extract code safely
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // ⚠️ API Key (you said you want it inside the file)
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  // ✅ Generate code
  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
     You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
      `,
      });

      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Copy Code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  // ✅ Download Code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

const selectTheme = {
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? "#020617" : "#ffffff",
      borderColor: isDark ? "#1e293b" : "#cbd5f5",
      color: isDark ? "#e5e7eb" : "#020617",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#7c3aed",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#020617" : "#ffffff",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#7c3aed"
        : state.isFocused
        ? isDark
          ? "#1e293b"
          : "#e0e7ff"
        : "transparent",
      color: state.isSelected
        ? "#ffffff"
        : isDark
        ? "#e5e7eb"
        : "#020617",
    }),
    singleValue: (base) => ({
      ...base,
      color: isDark ? "#e5e7eb" : "#020617",
    }),
    placeholder: (base) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
    }),
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <div className="flex items-center justify-between px-[100px] h-[90px]
                      border-b border-border-light dark:border-border-dark
                      bg-bg-light dark:bg-bg-dark">
        <h3 className="text-[26px] font-bold tracking-tight">Craft<span className="text-accent">.UI</span></h3>

        <button
          onClick={() => setIsDark(prev => !prev)}
          className="w-10 h-10 rounded-lg
                     bg-cardLight dark:bg-cardDark
                     border border-border-light dark:border-border-dark
                     flex items-center justify-center"
        >
          {isDark ? <HiSun /> : <HiMoon />}
        </button>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 lg:px-16 py-8">

        {/* ================= LEFT PANEL ================= */}
        <div className="rounded-xl p-6
                        bg-cardLight dark:bg-cardDark
                        border border-border-light dark:border-border-dark
                        space-y-5">

          <div>
            <h3 className="text-[24px] font-semibold">
              AI Component Generator
            </h3>
            <p className="text-text-mutedLight dark:text-text-mutedDark mt-1">
              Describe your component and let AI generate production-ready code.
            </p>
          </div>

          <div>
            <p className="font-semibold text-sm mb-1">Framework</p>
            <Select
              options={options}
              value={frameWork}
              styles={selectTheme}
              onChange={(selected) => setFrameWork(selected)}
            />
          </div>

          <div>
            <p className="font-semibold text-sm mb-1">
              Describe your component
            </p>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              className="w-full min-h-[180px] rounded-lg p-3 resize-none
                         bg-bg-light dark:bg-bg-dark
                         border border-border-light dark:border-border-dark
                         text-text-light dark:text-text-dark
                         placeholder-text-mutedLight
                         focus:ring-2 focus:ring-accent"
              placeholder={`Examples:\n• A modern login form with gradient button and smooth hover.\n• A pricing card with three tiers and animations.\n• A navbar with dropdown and smooth transitions.`}
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-text-mutedLight dark:text-text-mutedDark">
              Click generate to get your code
            </p>

            <button
              onClick={getResponse}
              className="flex items-center gap-2 px-6 py-3 rounded-lg
                         bg-accent text-white font-medium
                         hover:opacity-90 transition"
            >
              {loading ? <ClipLoader color="white" size={16} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="rounded-xl overflow-hidden
                        bg-cardLight dark:bg-cardDark
                        border border-border-light dark:border-border-dark
                        h-[80vh]">

          {!outputScreen ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 flex items-center justify-center
                              rounded-full bg-accent text-white text-2xl">
                <HiOutlineCode />
              </div>
              <p className="text-text-mutedLight dark:text-text-mutedDark">
                Your generated code will appear here
              </p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div
                className="
                  h-[52px] flex items-center gap-2 px-3
                  bg-panelLight dark:bg-panelDark
                  border-b border-border-light dark:border-border-dark
                "
              >
                <button
                  onClick={() => setTab(1)}
                  className={`
                    w-1/2 py-2 rounded-lg text-sm font-medium
                    transition-all
                    ${
                      tab === 1
                        ? "bg-accent text-white shadow"
                        : "bg-transparent text-text-mutedLight dark:text-text-mutedDark hover:bg-black/5 dark:hover:bg-white/5"
                    }
                  `}
                >
                  Code
                </button>

                <button
                  onClick={() => setTab(2)}
                  className={`
                    w-1/2 py-2 rounded-lg text-sm font-medium
                    transition-all
                    ${
                      tab === 2
                        ? "bg-accent text-white shadow"
                        : "bg-transparent text-text-mutedLight dark:text-text-mutedDark hover:bg-black/5 dark:hover:bg-white/5"
                    }
                  `}
                >
                  Preview
                </button>
              </div>
              {/* <div className="flex border-b border-border-light dark:border-border-dark">
                {["Code", "Preview"].map((label, i) => (
                  <button
                    key={label}
                    onClick={() => setTab(i + 1)}
                    className={`w-1/2 py-2 font-medium transition
                      ${tab === i + 1
                        ? "bg-accent text-white"
                        : "text-text-mutedLight dark:text-text-mutedDark"}`}
                  >
                    {label}
                  </button>
                ))}
              </div> */}

              {/* Toolbar */}
              <div
                className="
                  h-[52px] flex items-center justify-between px-4
                  bg-panelLight dark:bg-panelDark
                  border-b border-border-light dark:border-border-dark
                "
              >
                <p className="font-semibold text-sm">Code Editor</p>

                <div className="flex items-center gap-2">
                  {tab === 1 ? (
                    <>
                      <button
                        onClick={copyCode}
                        className="
                          w-10 h-10 rounded-xl
                          border border-border-light dark:border-border-dark
                          flex items-center justify-center
                          hover:bg-black/5 dark:hover:bg-white/5
                          transition
                        "
                      >
                        <IoCopy />
                      </button>

                      <button
                        onClick={downnloadFile}
                        className="
                          w-10 h-10 rounded-xl
                          border border-border-light dark:border-border-dark
                          flex items-center justify-center
                          hover:bg-black/5 dark:hover:bg-white/5
                          transition
                        "
                      >
                        <PiExportBold />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsNewTabOpen(true)}
                        className="
                          w-10 h-10 rounded-xl
                          border border-border-light dark:border-border-dark
                          flex items-center justify-center
                          hover:bg-black/5 dark:hover:bg-white/5
                          transition
                        "
                      >
                        <ImNewTab />
                      </button>

                      <button
                        onClick={() => setRefreshKey(prev => prev + 1)}
                        className="
                          w-10 h-10 rounded-xl
                          border border-border-light dark:border-border-dark
                          flex items-center justify-center
                          hover:bg-black/5 dark:hover:bg-white/5
                          transition
                        "
                      >
                        <FiRefreshCcw />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* <div className="h-[50px] flex items-center justify-between px-4
                              border-b border-border-light dark:border-border-dark">
                <p className="font-semibold">Editor</p>
                <div className="flex gap-2">
                  <button onClick={copyCode} className="icon-btn"><IoCopy /></button>
                  <button onClick={downnloadFile} className="icon-btn"><PiExportBold /></button>
                </div>
              </div> */}

              {/* Editor */}
              <div className="h-[calc(80vh-104px)]">
                {tab === 1 ? (
                  <Editor
                    value={code}
                    height="100%"
                    theme={isDark ? "vs-dark" : "light"}
                    language="html"
                  />
                ) : (
                  <iframe
                    key={refreshKey}
                    srcDoc={code}
                    className="w-full h-full bg-white text-black"
                  />
                )}
              </div>
              {/* <div className="h-full">
                <Editor
                  value={code}
                  height="100%"
                  language="html"
                  theme={isDark ? "vs-dark" : "light"}
                />
              </div> */}
            </>
          )}
        </div>

        {/* ================= FULLSCREEN PREVIEW ================= */}
        {isNewTabOpen && (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="h-[60px] flex items-center justify-between px-5 bg-gray-100 border-b">
              <p className="font-bold text-black">Preview</p>
              <button
                onClick={() => setIsNewTabOpen(false)}
                className="
                  w-10 h-10 rounded-xl
                  border border-gray-300
                  flex items-center justify-center
                  hover:bg-gray-200
                  transition
                "
              >
                <IoCloseSharp />
              </button>
            </div>

            <iframe
              srcDoc={code}
              className="w-full h-[calc(100vh-60px)]"
            />
          </div>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex items-center justify-between px-[100px] h-[90px]
                      border-b border-border-light dark:border-border-dark
                      bg-bg-light dark:bg-bg-dark">
        
        {/* Left Text */}
        <p className="text-[14px]">
          Made with ❤️ by <span className="font-semibold text-purple-500">Pukhraj Choudhary</span>
        </p>

        {/* Links */}
        <a
          href="https://github.com/pukhraj102/Craft-UI"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
          className="flex items-center gap-2 hover:text-purple-500 transition-colors"
        >
          <FaGithub /> <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </>
  );
};

export default Home
