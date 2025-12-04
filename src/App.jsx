import React, { useState } from 'react';
import { 
  Activity, 
  Shield, 
  Zap, 
  Swords, 
  Star, 
  Wind, 
  Layers, 
  Cpu, 
  Trophy,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    hp: 0,
    attack: 0,
    defense: 0,
    sp_atk: 0,
    sp_def: 0,
    speed: 0,
    generation: 1
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputs = [
    { name: 'hp', label: 'HP (Vida)', icon: Activity, min: 1, max: 255, color: 'text-red-500' },
    { name: 'attack', label: 'Attack', icon: Swords, min: 1, max: 255, color: 'text-orange-500' },
    { name: 'defense', label: 'Defense', icon: Shield, min: 1, max: 255, color: 'text-blue-500' },
    { name: 'sp_atk', label: 'Sp. Atk', icon: Star, min: 1, max: 255, color: 'text-purple-500' },
    { name: 'sp_def', label: 'Sp. Def', icon: Layers, min: 1, max: 255, color: 'text-green-500' },
    { name: 'speed', label: 'Speed', icon: Wind, min: 1, max: 255, color: 'text-cyan-500' },
    { name: 'generation', label: 'Generation', icon: Cpu, min: 1, max: 9, color: 'text-gray-500' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value, 10);
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(intValue) ? 0 : intValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('https://mlpokemonflask-fpb2dhhzbzexfseh.brazilsouth-01.azurewebsites.net/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const textResult = await response.text();
      
      // Limpeza da resposta
      let cleanResult = textResult;
      try {
        const jsonResult = JSON.parse(textResult);
        cleanResult = jsonResult.prediction || jsonResult.result || jsonResult.data || jsonResult;
        
        if (typeof cleanResult === 'object') {
           cleanResult = JSON.stringify(cleanResult);
        }
      } catch (e) {
        cleanResult = textResult;
      }

      setPrediction(String(cleanResult).replace(/['"]+/g, '').trim());

    } catch (err) {
      console.error("Erro:", err);
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        setError('Erro de conexão. Se estiver testando localmente (localhost), pode ser um bloqueio de segurança (CORS) do navegador ou a API está offline.');
      } else {
        setError(err.message || 'Ocorreu um erro ao consultar a IA.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        <div className="flex-1 p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Zap className="text-yellow-500 fill-yellow-500" />
              PokéPredictor AI
            </h1>
            <p className="text-slate-500">
              Insira os status do Pokémon para a IA prever sua raridade (Comum, Lendário, etc).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inputs.map((input) => (
                <div key={input.name} className="relative group">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 ml-1">
                    {input.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <input.icon className={`h-5 w-5 ${input.color}`} />
                    </div>
                    <input
                      type="number"
                      name={input.name}
                      value={formData[input.name]}
                      onChange={handleChange}
                      min={input.min}
                      max={input.max}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm font-medium"
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white transition-all duration-200 
                ${loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analisando Dados...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Prever Raridade
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <div className="md:w-80 bg-slate-900 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10 text-center w-full">
            <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            
            <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">
              Resultado da Análise
            </h2>

            {prediction ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                  <span className="block text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-2">
                    {prediction}
                  </span>
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto rounded-full"></div>
                </div>
                <p className="text-slate-400 mt-6 text-sm">
                  Baseado no modelo de ML treinado
                </p>
              </div>
            ) : (
              <div className="text-slate-600 border-2 border-dashed border-slate-700 rounded-2xl p-8">
                <p className="text-sm">
                  Preencha os dados e clique em prever para ver o resultado aqui.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}