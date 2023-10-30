import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";
import { LocaleType } from "./index";

// if you are adding a new translation, please use PartialLocaleType instead of LocaleType

const isApp = !!getClientConfig()?.isApp;
const en: {
  Context: { Add: string; Toast: (x: any) => string; Revert: string; Edit: string; Clear: string }; Memory: { ResetConfirm: string; Copy: string; Title: string; Reset: string; EmptyContent: string; Send: string }; Mask: { Item: { Delete: string; Chat: string; Edit: string; Info: (count: number) => string; View: string; DeleteConfirm: string }; Config: { Sync: { Title: string; Confirm: string; SubTitle: string }; Share: { Action: string; Title: string; SubTitle: string }; Avatar: string; HideContext: { Title: string; SubTitle: string }; Name: string }; Page: { Create: string; Search: string; Title: string; SubTitle: (count: number) => string }; EditModal: { Title: (readonly: boolean) => string; Download: string; Clone: string }; Name: string }; Error: { Unauthorized: string }; ChatItem: { ChatItemCount: (count: number) => string }; Store: { DefaultTopic: string; BotHello: string; Error: string; Prompt: { History: (content: string) => string; Topic: string; Summarize: string } }; Exporter: { Messages: string; Model: string; Time: string; Topic: string }; NewChat: { More: string; Return: string; Skip: string; Title: string; NotShow: string; ConfirmNoShow: string; list: string; SubTitle: string }; UI: { Cancel: string; Create: string; Confirm: string; Close: string; Edit: string }; Copy: { Failed: string; Success: string }; Auth: { Later: string; Input: string; Title: string; Confirm: string; Tips: string }; Chat: { Input: (submitKey: string) => string; Typing: string; Actions: { Delete: string; Pin: string; PinToastContent: string; ChatList: string; Copy: string; Stop: string; PinToastAction: string; Export: string; Edit: string; Retry: string; CompressedHistory: string }; InputActions: { Stop: string; Theme: { auto: string; light: string; dark: string }; Prompt: string; Masks: string; ToBottom: string; Settings: string; Clear: string }; Config: { Reset: string; SaveAs: string }; Commands: { next: string; new: string; prev: string; clear: string; del: string; newm: string }; EditMessage: { Title: string; Topic: { Title: string; SubTitle: string } }; SubTitle: (count: number) => string; Rename: string; Send: string; IsContext: string }; Select: { All: string; Search: string; Latest: string; Clear: string }; Export: { Steps: { Select: string; Preview: string }; MessageFromYou: string; MessageFromChatGPT: string; Format: { Title: string; SubTitle: string }; Copy: string; Title: string; IncludeContext: { Title: string; SubTitle: string }; Image: { Toast: string; Modal: string }; Download: string; Share: string }; URLCommand: { Code: string; Settings: string }; Midjourney: { PleaseWait: string; UnknownError: string; HasImgTip: string; StatusCode: (code: number) => string; Url: string; RespBody: (body: string) => string; TaskRemoteSubmit: string; InputDisabled: string; ImageAgentOpenTip: string; ModeImagineUseImg: string; ModeBlend: string; TaskErrNotSupportType: (type: string) => string; NeedInputUseImgPrompt: string; BlendMinImg: (min: number, max: number) => string; TaskErrUnknownType: string; UnknownReason: string; TaskNotStart: string; TaskSubmitOk: string; SelectImgMax: (max: number) => string; TaskStatusFetchFail: string; TaskStatus: string; ImageAgent: string; TaskPrefix: (prompt: string, taskId: string) => string; TaskProgressTip: (progress: (number | undefined)) => string; ModeDescribe: string; None: string; TaskSubmitErr: (err: string) => string }; Home: { DeleteToast: string; NewChat: string; DeleteChat: string; Revert: string }; Settings: {
    AutoGenerateTitle: { Title: string; SubTitle: string }; Temperature: { Title: string; SubTitle: string }; MaxTokens: { Title: string; SubTitle: string }; Token: { Placeholder: string; Title: string; SubTitle: string }; Update: { IsChecking: string; Version: (x: string) => string; CheckUpdate: string; FoundUpdate: (x: string) => string; GoToUpdate: string; IsLatest: string }; InjectSystemPrompts: { Title: string; SubTitle: string }; Endpoint: { Title: string; SubTitle: string }; Danger: { Reset: { Action: string; Title: string; Confirm: string; SubTitle: string }; Clear: { Action: string; Title: string; Confirm: string; SubTitle: string } }; TopP: { Title: string; SubTitle: string }; PresencePenalty: { Title: string; SubTitle: string }; SubTitle: string; Usage: { IsChecking: string; Check: string; Title: string; SubTitle(used: any, total: any): string; NoAccess: string }; Mask: { Splash: { Title: string; SubTitle: string }; Builtin: { Title: string; SubTitle: string } }; Title: string; AccessCode: { Placeholder: string; Title: string; SubTitle: string }; Lang: { All: string; Name: string }; InputTemplate: { Title: string; SubTitle: string }; SendKey: string; Avatar: string; CustomModel: { Title: string; SubTitle: string }; CompressThreshold: { Title: string; SubTitle: string }; HistoryCount: { Title: string; SubTitle: string }; SendPreviewBubble: { Title: string; SubTitle: string }; FontSize: { Title: string; SubTitle: string }; Model: string; FrequencyPenalty: { Title: string; SubTitle: string }; Theme: string; Prompt: { List: string; Edit: string; EditModal: { Title: string }; Modal: { Add: string; Search: string; Title: string }; Disable: { Title: string; SubTitle: string }; ListCount: (builtin: number, custom: number) => string }; TightBorder: string
  }; WIP: string; Plugin: { Name: string }
} = {
  WIP: "Coming Soon...",
  Error: {
    Unauthorized: isApp
      ? "Invalid API Key, please check it in [Settings](/#/settings) page."
      : "Unauthorized access, please enter access code in [auth](/#/auth) page, or enter your OpenAI API Key.",
  },
  Auth: {
    Title: "Need Access Code",
    Tips: "Please enter access code below",
    Input: "access code",
    Confirm: "Confirm",
    Later: "Later",
  },
  Midjourney: {
    SelectImgMax: (max: number) => `Select up to ${max} images`,
    InputDisabled: "Input is disabled in this mode",
    HasImgTip:
      "Tip: In the mask mode, only the first image will be used. In the blend mode, the five selected images will be used in order (click the image to remove it)",
    ModeImagineUseImg: "Mask Mode",
    ModeBlend: "Blend Mode",
    ModeDescribe: "Describe Mode",
    NeedInputUseImgPrompt:
      'You need to enter content to use the image in the mask mode, please enter the content starting with "/mj"',
    BlendMinImg: (min: number, max: number) =>
      `At least ${min} images are required in the mixed image mode, and up to ${max} images are required`,
    TaskErrUnknownType: "Task submission failed: unknown task type",
    TaskErrNotSupportType: (type: string) =>
      `Task submission failed: unsupported task type -> ${type}`,
    StatusCode: (code: number) => `Status code: ${code}`,
    TaskSubmitErr: (err: string) => `Task submission failed: ${err}`,
    RespBody: (body: string) => `Response body: ${body}`,
    None: "None",
    UnknownError: "Unknown error",
    UnknownReason: "Unknown reason",
    TaskPrefix: (prompt: string, taskId: string) =>
      `**Prompt:** ${prompt}\n**Task ID:** ${taskId}\n`,
    PleaseWait: "Please wait a moment",
    TaskSubmitOk: "Task submitted successfully",
    TaskStatusFetchFail: "Failed to get task status",
    TaskStatus: "Task status",
    TaskRemoteSubmit: "Task has been submitted to Midjourney server",
    TaskProgressTip: (progress: number | undefined) =>
      `Task is running${progress ? `, current progress: ${progress}` : ""}`,
    TaskNotStart: "Task has not started",
    Url: "URL",
    ImageAgent: "Image Agent",
    ImageAgentOpenTip:
      "After turning it on, the returned Midjourney image will be proxied by this program itself, so this program needs to be in a network environment that can access cdn.discordapp.com to be effective",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} messages`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} messages`,
    EditMessage: {
      Title: "Edit All Messages",
      Topic: {
        Title: "Topic",
        SubTitle: "Change the current topic",
      },
    },
    Actions: {
      ChatList: "Go To Chat List",
      CompressedHistory: "Compressed History Memory Prompt",
      Export: "Export All Messages as Markdown",
      Copy: "Copy",
      Stop: "Stop",
      Retry: "Retry",
      Pin: "Pin",
      PinToastContent: "Pinned 1 messages to contextual prompts",
      PinToastAction: "View",
      Delete: "Delete",
      Edit: "Edit",
    },
    Commands: {
      new: "Start a new chat",
      newm: "Start a new chat with mask",
      next: "Next Chat",
      prev: "Previous Chat",
      clear: "Clear Context",
      del: "Delete Chat",
    },
    InputActions: {
      Stop: "Stop",
      ToBottom: "To Latest",
      Theme: {
        auto: "Auto",
        light: "Light Theme",
        dark: "Dark Theme",
      },
      Prompt: "Prompts",
      Masks: "Masks",
      Clear: "Clear Context",
      Settings: "Settings",
    },
    Rename: "Rename Chat",
    Typing: "Typing…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} to send`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter to wrap";
      }
      return inputHints + ", / to search prompts, : to use commands";
    },
    Send: "Send",
    Config: {
      Reset: "Reset to Default",
      SaveAs: "Save as Mask",
    },
    IsContext: "Contextual Prompt",
  },
  Export: {
    Title: "Export Messages",
    Copy: "Copy All",
    Download: "Download",
    MessageFromYou: "Message From You",
    MessageFromChatGPT: "Message From ChatGPT",
    Share: "Share to ShareGPT",
    Format: {
      Title: "Export Format",
      SubTitle: "Markdown or PNG Image",
    },
    IncludeContext: {
      Title: "Including Context",
      SubTitle: "Export context prompts in mask or not",
    },
    Steps: {
      Select: "Select",
      Preview: "Preview",
    },
    Image: {
      Toast: "Capturing Image...",
      Modal: "Long press or right click to save image",
    },
  },
  Select: {
    Search: "Search",
    All: "Select All",
    Latest: "Select Latest",
    Clear: "Clear",
  },
  Memory: {
    Title: "Memory Prompt",
    EmptyContent: "Nothing yet.",
    Send: "Send Memory",
    Copy: "Copy Memory",
    Reset: "Reset Session",
    ResetConfirm:
      "Resetting will clear the current conversation history and historical memory. Are you sure you want to reset?",
  },
  Home: {
    NewChat: "New Chat",
    DeleteChat: "Confirm to delete the selected conversation?",
    DeleteToast: "Chat Deleted",
    Revert: "Revert",
  },
  Settings: {
    Title: "Settings",
    SubTitle: "All Settings",
    Danger: {
      Reset: {
        Title: "Reset All Settings",
        SubTitle: "Reset all setting items to default",
        Action: "Reset",
        Confirm: "Confirm to reset all settings to default?",
      },
      Clear: {
        Title: "Clear All Data",
        SubTitle: "Clear all messages and settings",
        Action: "Clear",
        Confirm: "Confirm to clear all messages and settings?",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "All Languages",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Font Size",
      SubTitle: "Adjust font size of chat content",
    },
    InjectSystemPrompts: {
      Title: "Inject System Prompts",
      SubTitle: "Inject a global system prompt for every request",
    },
    InputTemplate: {
      Title: "Input Template",
      SubTitle: "Newest message will be filled to this template",
    },

    Update: {
      Version: (x: string) => `Version: ${x}`,
      IsLatest: "Latest version",
      CheckUpdate: "Check Update",
      IsChecking: "Checking update...",
      FoundUpdate: (x: string) => `Found new version: ${x}`,
      GoToUpdate: "Update",
    },
    SendKey: "Send Key",
    Theme: "Theme",
    TightBorder: "Tight Border",
    SendPreviewBubble: {
      Title: "Send Preview Bubble",
      SubTitle: "Preview markdown in bubble",
    },
    AutoGenerateTitle: {
      Title: "Auto Generate Title",
      SubTitle: "Generate a suitable title based on the conversation content",
    },
    Mask: {
      Splash: {
        Title: "Mask Splash Screen",
        SubTitle: "Show a mask splash screen before starting new chat",
      },
      Builtin: {
        Title: "Hide Builtin Masks",
        SubTitle: "Hide builtin masks in mask list",
      },
    },
    Prompt: {
      Disable: {
        Title: "Disable auto-completion",
        SubTitle: "Input / to trigger auto-completion",
      },
      List: "Prompt List",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} built-in, ${custom} user-defined`,
      Edit: "Edit",
      Modal: {
        Title: "Prompt List",
        Add: "Add One",
        Search: "Search Prompts",
      },
      EditModal: {
        Title: "Edit Prompt",
      },
    },
    HistoryCount: {
      Title: "Attached Messages Count",
      SubTitle: "Number of sent messages attached per request",
    },
    CompressThreshold: {
      Title: "History Compression Threshold",
      SubTitle:
        "Will compress if uncompressed messages length exceeds the value",
    },
    Token: {
      Title: "API Key",
      SubTitle: "Use your key to ignore access code limit",
      Placeholder: "OpenAI API Key",
    },
    Usage: {
      Title: "Account Balance",
      SubTitle(used: any, total: any) {
        return `Used this month $${used}, subscription $${total}`;
      },
      IsChecking: "Checking...",
      Check: "Check",
      NoAccess: "Enter API Key to check balance",
    },
    AccessCode: {
      Title: "Access Code",
      SubTitle: "Access control enabled",
      Placeholder: "Need Access Code",
    },
    Endpoint: {
      Title: "Endpoint",
      SubTitle: "Custom endpoint must start with http(s)://",
    },
    CustomModel: {
      Title: "Custom Models",
      SubTitle: "Add extra model options, separate by comma",
    },
    Model: "Model",
    Temperature: {
      Title: "Temperature",
      SubTitle: "A larger value makes the more random output",
    },
    TopP: {
      Title: "Top P",
      SubTitle: "Do not alter this value together with temperature",
    },
    MaxTokens: {
      Title: "Max Tokens",
      SubTitle: "Maximum length of input tokens and generated tokens",
    },
    PresencePenalty: {
      Title: "Presence Penalty",
      SubTitle:
        "A larger value increases the likelihood to talk about new topics",
    },
    FrequencyPenalty: {
      Title: "Frequency Penalty",
      SubTitle:
        "A larger value decreasing the likelihood to repeat the same line",
    },
  },
  Store: {
    DefaultTopic: "New Conversation",
    BotHello: "Hello! How can I assist you today?",
    Error: "Something went wrong, please try again later.",
    Prompt: {
      History: (content: string) =>
        "This is a summary of the chat history as a recap: " + content,
      Topic:
        "Please generate a four to five word title summarizing our conversation without any lead-in, punctuation, quotation marks, periods, symbols, or additional text. Remove enclosing quotation marks.",
      Summarize:
        "Summarize the discussion briefly in 200 words or less to use as a prompt for future context.",
    },
  },
  Copy: {
    Success: "Copied to clipboard",
    Failed: "Copy failed, please grant permission to access clipboard",
  },
  Context: {
    Toast: (x: any) => `With ${x} contextual prompts`,
    Edit: "Current Chat Settings",
    Add: "Add a Prompt",
    Clear: "Context Cleared",
    Revert: "Revert",
  },
  Plugin: {
    Name: "Plugin",
  },
  Mask: {
    Name: "Mask",
    Page: {
      Title: "Prompt Template",
      SubTitle: (count: number) => `${count} prompt templates`,
      Search: "Search Templates",
      Create: "Create",
    },
    Item: {
      Info: (count: number) => `${count} prompts`,
      Chat: "Chat",
      View: "View",
      Edit: "Edit",
      Delete: "Delete",
      DeleteConfirm: "Confirm to delete?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Edit Prompt Template ${readonly ? "(readonly)" : ""}`,
      Download: "Download",
      Clone: "Clone",
    },
    Config: {
      Avatar: "Bot Avatar",
      Name: "Bot Name",
      Sync: {
        Title: "Use Global Config",
        SubTitle: "Use global config in this chat",
        Confirm: "Confirm to override custom config with global config?",
      },
      HideContext: {
        Title: "Hide Context Prompts",
        SubTitle: "Do not show in-context prompts in chat",
      },
      Share: {
        Title: "Share This Mask",
        SubTitle: "Generate a link to this mask",
        Action: "Copy Link",
      },
    },
  },
  NewChat: {
    Return: "Return",
    list: "Chat List",
    Skip: "Just Start",
    Title: "Pick a Mask",
    SubTitle: "Chat with the Soul behind the Mask",
    More: "Find More",
    NotShow: "Never Show Again",
    ConfirmNoShow: "Confirm to disable？You can enable it in settings later.",
  },

  UI: {
    Confirm: "Confirm",
    Cancel: "Cancel",
    Close: "Close",
    Create: "Create",
    Edit: "Edit",
  },
  Exporter: {
    Model: "Model",
    Messages: "Messages",
    Topic: "Topic",
    Time: "Time",
  },

  URLCommand: {
    Code: "Detected access code from url, confirm to apply? ",
    Settings: "Detected settings from url, confirm to apply?",
  },
};

export default en;
