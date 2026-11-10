/**
 * Server-side Gemini AI Service for Genius Zone Model School (GZMS)
 * Handles multi-turn chat, system instructions, role personas, and model dispatch.
 */

import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type ChatRole = 'ACADEMIC_COUNSELOR' | 'STUDENT_TUTOR' | 'ADMIN_ASSISTANT';

export const ROLE_SYSTEM_INSTRUCTIONS: Record<ChatRole, string> = {
  ACADEMIC_COUNSELOR: `You are the official Senior Academic Counselor and Admission Advisor for Genius Zone Model School (GZMS / জিনিয়াস জোন মডেল স্কুল), located in Balachowra, Badarganj, Rangpur, Bangladesh (Phone: 01308177171, Email: info.sbf21@gmail.com, Tagline: "Where Dreams Come True / যেখানে স্বপ্ন সত্যি হয়।").
Your role is to warmly assist parents, students, and visitors in both Bengali and English.
Provide clear details about:
- Admissions for Academic Session 2026 (Play Group to Class 9)
- Curriculum and modern facilities (Smart QR attendance, instant absentee SMS at 9:20 AM, digital multimedia classrooms)
- School fees, scholarships (up to 25% waiver for meritorious/needy), bKash payments (01308177171)
- Exams, results, routines, and school ethics.
Always be respectful, encouraging, and accurate to the school's Bangladeshi rural-modern context.`,

  STUDENT_TUTOR: `You are the friendly, encouraging AI Homework and Subject Tutor for Genius Zone Model School students (Play Group to Class 9).
You help students understand concepts in Mathematics, General Science, English grammar, Bengali literature, and ICT.
Explain step-by-step with simple examples. Encourage good study habits, moral conduct, and problem-solving without doing all their homework for them. Support both Bengali and English.`,

  ADMIN_ASSISTANT: `You are the School Administration AI Assistant for the Founder & Director (Md. Delowar Hossain) and Head Teacher (Md. Rafiqul Islam) at Genius Zone Model School.
Help draft official school notices, examination circulars, speech outlines, parent communication templates, SMS alerts, and academic routines conforming to Bangladesh Education Board conventions.`,
};

export async function handleGeminiChat(params: {
  messages?: ChatMessage[];
  message?: string;
  role?: ChatRole;
  model?: string;
  history?: ChatMessage[];
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Normalize input messages
  let rawMessages: ChatMessage[] = [];
  if (Array.isArray(params.messages) && params.messages.length > 0) {
    rawMessages = params.messages;
  } else if (Array.isArray(params.history) && params.history.length > 0) {
    rawMessages = [...params.history];
    if (params.message) {
      rawMessages.push({ role: 'user', text: params.message });
    }
  } else if (params.message) {
    rawMessages = [{ role: 'user', text: params.message }];
  }

  // Find latest user query
  const lastUserMsg = [...rawMessages].reverse().find((m) => m.role === 'user');
  const userQuery = (lastUserMsg?.text || params.message || '').trim().toLowerCase();

  const activeRole: ChatRole = params.role || 'ACADEMIC_COUNSELOR';

  // If no API key is configured yet in environment, provide high quality school assistant answers
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return generateFallbackSchoolReply(userQuery, activeRole);
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Allowed models: gemini-3.8-flash (default), gemini-3.1-flash-lite (fast), gemini-4-argon (complex)
  const allowedModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon'];
  const targetModel = allowedModels.includes(params.model || '') ? (params.model as string) : 'gemini-3.8-flash';

  const systemInstruction = ROLE_SYSTEM_INSTRUCTIONS[activeRole] || ROLE_SYSTEM_INSTRUCTIONS.ACADEMIC_COUNSELOR;

  // Gemini contents must begin with a 'user' turn. Filter out any leading 'model' messages.
  const firstUserIdx = rawMessages.findIndex((m) => m.role === 'user');
  const validMessages = firstUserIdx >= 0 ? rawMessages.slice(firstUserIdx) : [{ role: 'user' as const, text: userQuery || 'Hello' }];

  // Format messages into GoogleGenAI contents array
  const contents = validMessages.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: targetModel,
      contents,
      config: {
        systemInstruction,
      },
    });

    return response.text || 'জিনিয়াস জোন মডেল স্কুলে স্বাগতম! আপনার অনুরোধ অনুযায়ী বিস্তারিত তথ্য জানতে স্কুল হেল্পলাইনে (০১৩০৮১৭৭১৭১) যোগাযোগ করতে পারেন।';
  } catch (err: unknown) {
    console.error('Gemini API Error:', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('PERMISSION_DENIED')) {
      return generateFallbackSchoolReply(userQuery, activeRole) + '\n\n*(সার্ভারে API কী কনফিগারেশন চেক করুন)*';
    }
    if (errMsg.includes('RESOURCE_EXHAUSTED')) {
      return 'কোটা পূর্ণ হয়েছে। অনুগ্রহ করে কিছু সময় পর চেষ্টা করুন বা সাধারণ তথ্যের জন্য ০১৩০৮১৭৭১৭১ নম্বরে যোগাযোগ করুন।';
    }
    return generateFallbackSchoolReply(userQuery, activeRole);
  }
}

function generateFallbackSchoolReply(query: string, role: ChatRole): string {
  if (role === 'ADMIN_ASSISTANT') {
    if (query.includes('notice') || query.includes('নোটিশ') || query.includes('ছুটি')) {
      return `[নোটিশ খসড়া]\n\nবিষয়: পবিত্র রমজান ও বার্ষিক ক্রীড়া প্রতিযোগিতা উপলক্ষে বিজ্ঞপ্তি\n\nএতদ্বারা জিনিয়াস জোন মডেল স্কুলের সকল শিক্ষক, শিক্ষার্থী ও অভিভাবকদের অবগতির জন্য জানানো যাচ্ছে যে, আগামী সপ্তাহে বার্ষিক ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতা অনুষ্ঠিত হবে। সকল শিক্ষার্থীকে নির্ধারিত পোশাকে উপস্থিত থাকতে অনুরোধ করা হচ্ছে।\n\nস্বাক্ষরিত:\nমোঃ দেলোয়ার হোসেন (পরিচালক)\nমোঃ রফিকুল ইসলাম (প্রধান শিক্ষক)\nজিনিয়াস জোন মডেল স্কুল, বদরগঞ্জ, রংপুর।`;
    }
    return `জিনিয়াস জোন মডেল স্কুল প্রশাসনিক সহকারী প্রস্তুত। আপনি নোটিশ খসড়া, পরীক্ষা রুটিন, এসএমএস অ্যালার্ট বা অভিভাবক বার্তার ফরম্যাট চাইতে পারেন।`;
  }

  if (role === 'STUDENT_TUTOR') {
    if (query.includes('math') || query.includes('গণিত') || query.includes('সূত্র') || query.includes('পীথাগোরাস')) {
      return `গণিত সহায়িকা:\n১. পীথাগোরাসের উপপাদ্য: অতিভুজ² = লম্ব² + ভূমি² (a² + b² = c²)\n২. বৃত্তের ক্ষেত্রফল = πr²\n৩. (a + b)² = a² + 2ab + b²\n\nআপনার নির্দিষ্ট কোনো অংকে সমস্যা থাকলে বিস্তারিত লিখুন, আমি ধাপে ধাপে সমাধান বুঝিয়ে দেব!`;
    }
    if (query.includes('english') || query.includes('ইংরেজি') || query.includes('tense')) {
      return `English Grammar Tip:\nThere are 3 main tenses: Present, Past, and Future. Each has 4 forms: Simple, Continuous, Perfect, and Perfect Continuous.\nExample: "I study at GZMS" (Present Simple), "I am learning" (Present Continuous). Feel free to ask about any grammar rule!`;
    }
    return `আমি জিনিয়াস জোন মডেল স্কুলের এআই স্টুডেন্ট টিউটর! গণিত, বিজ্ঞান, ইংরেজি ব্যাকরণ বা আইসিটি বিষয়ক যেকোনো প্রশ্ন আমাকে করতে পারো।`;
  }

  // ACADEMIC_COUNSELOR (Default)
  if (query.includes('ভর্তি') || query.includes('admission') || query.includes('form') || query.includes('ফরম') || query.includes('class') || query.includes('শ্রেণী')) {
    return `🎓 **জিনিয়াস জোন মডেল স্কুল (GZMS) - ২০২৬ শিক্ষাবর্ষে ভর্তি তথ্য:**\n\n• **শ্রেণীসমূহ:** প্লে গ্রুপ থেকে ৯ম শ্রেণী পর্যন্ত বালক ও বালিকা শাখা।\n• **আবেদন পদ্ধতি:** আমাদের ওয়েবসাইটের "অনলাইন ভর্তি আবেদন" বোতামে ক্লিক করে সরাসরি ফরম পূরণ করুন। পূরণ শেষে তাৎক্ষণিক একক পাতার A4 আবেদন কপি ডাউনলোড করতে পারবেন।\n• **ভর্তি ফরম ফি:** ১০০/- টাকা (বিকাশ: 01308177171)।\n• **ভর্তি পরীক্ষায় যা প্রয়োজন:** ২ কপি পাসপোর্ট ছবি, পূর্ববর্তী ক্লাসের মার্কশীট ও জন্ম নিবন্ধন সনদ।\n• **ঠিকানা:** বালাচৌড়া, বদরগঞ্জ, রংপুর।\n• **হেল্পলাইন:** ০১৩০৮১৭৭১৭১ (সকাল ৮টা - রাত ৮টা)।`;
  }

  if (query.includes('fee') || query.includes('ফি') || query.includes('টাকা') || query.includes('খরচ') || query.includes('bkash') || query.includes('বিকাশ')) {
    return `💳 **ফি ও বেতন পরিশোধ নির্দেশিকা:**\n\n• **মাসিক বেতন:** ৫০০ টাকা থেকে ১,২০০ টাকা (শ্রেণীভেদে)।\n• **বিকাশ পেমেন্ট:** বিকাশ মার্চেন্ট/ব্যক্তিগত নম্বর **01308177171**-এ সেন্ড মানি করে TrxID সংগ্রহ করুন।\n• **রশিদ গ্রহণ:** স্টুডেন্ট পোর্টাল বা অ্যাডমিন অফিসে TrxID ভেরিফাই করে তাৎক্ষণিক ডিজিটাল পেইড সিলযুক্ত রশিদ (A4 Fee Challan) সংগ্রহ করতে পারবেন।\n• **বৃত্তি ও ছাড়:** মেধাবী ও অসচ্ছল শিক্ষার্থীদের জন্য সর্বোচ্চ ২৫% মাসিক ফি মওকুফের ব্যবস্থা রয়েছে।`;
  }

  if (query.includes('qr') || query.includes('হাজিরা') || query.includes('attendance') || query.includes('উপস্থিতি')) {
    return `📱 **স্মার্ট কিউআর হাজিরা ও স্বয়ংক্রিয় এসএমএস ব্যবস্থা:**\n\n• প্রতিটি শিক্ষার্থীর ডিজিটাল আইডি কার্ডে একটি অনন্য কিউআর কোড থাকে।\n• সকাল ৮:৪৫ থেকে ৯:১৫ এর মধ্যে স্কুলে প্রবেশের সময় কিউআর স্ক্যান করা হয় এবং বাংলায় নাম ঘোষণা ("উপস্থিতি গ্রহণ করা হয়েছে") হয়।\n• সকাল ৯:২০ মিনিটে অনুপস্থিত শিক্ষার্থীদের চিহ্নিত করে স্বয়ংক্রিয়ভাবে অভিভাবকের মোবাইলে সতর্কতামূলক এসএমএস পাঠানো হয়।`;
  }

  if (query.includes('result') || query.includes('ফলাফল') || query.includes('marksheet')) {
    return `📊 **ফলাফল অনুসন্ধান ও মার্কশীট:**\n\n• আমাদের হোমপেজের "ফলাফল অনুসন্ধান" বোতামে ক্লিক করে ভর্তি পরীক্ষার ফলাফল অথবা একাডেমিক পরীক্ষার ফলাফল (রেজিস্ট্রেশন নম্বর বা রোল দিয়ে) দেখতে পারেন।\n• একই সাথে গ্রেডিং পয়েন্ট ও প্রধান শিক্ষকের স্বাক্ষরযুক্ত একক পাতার A4 মার্কশীট প্রিন্ট করতে পারবেন।`;
  }

  if (query.includes('যোগাযোগ') || query.includes('contact') || query.includes('ঠিকানা') || query.includes('ফোন') || query.includes('phone')) {
    return `📞 **যোগাযোগের তথ্য:**\n\n• **প্রতিষ্ঠান:** জিনিয়াস জোন মডেল স্কুল (GZMS)\n• **অবস্থান:** বালাচৌড়া, বদরগঞ্জ, রংপুর, বাংলাদেশ\n• **মোবাইল:** ০১৩০৮১৭৭১৭১\n• **ইমেইল:** info.sbf21@gmail.com\n• **স্লোগান:** যেখানে স্বপ্ন সত্যি হয় (Where Dreams Come True)`;
  }

  return `আসসালামু আলাইকুম! জিনিয়াস জোন মডেল স্কুলের ডিজিটাল হেল্পডেস্কে আপনাকে স্বাগতম। আপনি ২০২৬ শিক্ষাবর্ষে ভর্তি, মাসিক ফি, স্মার্ট কিউআর হাজিরা, পরীক্ষার ফলাফল বা যেকোনো বিষয়ে জানতে প্রশ্ন করতে পারেন।`;
}
