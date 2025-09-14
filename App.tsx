
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import { generateImageFromPhrase } from './services/geminiService';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a phrase to generate an image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImageFromPhrase(prompt);
      setImageUrl(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate image: ${errorMessage}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8">
          <div className="flex flex-col gap-8">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
            <ImageDisplay 
              imageUrl={imageUrl} 
              isLoading={isLoading} 
              error={error} 
              prompt={prompt}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
