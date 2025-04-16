import Groq  from 'groq-sdk';

console.log(process.env.GROQ_API_KEY)
// Initialize Groq client
const groq = new Groq({apiKey: "process.env.GROQ_API_KEY"});

// Types for the function parameters and return value
interface LlamaResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface LlamaOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

/**
 * Utility function to interact with Llama model via Groq
 * @param prompt The input prompt for the model
 * @param options Optional configuration for the model
 * @returns Promise with the model's response
 */
export async function generateWithLlama(
  prompt: string,
  options: LlamaOptions = {}
): Promise<LlamaResponse> {
  try {
    const defaultOptions = {
      model: 'llama3-70b-8192', // Using the latest Llama 3 70B model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      ...options,
    };

    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      ...defaultOptions,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage,
    };
  } catch (error) {
    console.error('Error generating with Llama:', error);
    throw new Error('Failed to generate response with Llama model');
  }
}

// Example usage:
/*
const response = await generateWithLlama('What is the capital of France?', {
  temperature: 0.8,
  max_tokens: 100
});
console.log(response.content);
*/ 