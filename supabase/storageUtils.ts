import { supabase } from "./supabaseClient";

const exportarCasos = async (id: number) => {
  const path = `envios/${id}/`;

  const { data, error } = await supabase.storage
    .from('documents')
    .list(path, {
      limit: 100,
      offset: 0,
    });

  if (error) {
    console.error('Erro ao listar casos:', error);
    return;
  }

  // filtra só os diretórios (pastas)
  const pastas = data.filter(item => item.name && item.metadata?.eTag === undefined);

  // setCasos(pastas); // salva os "casos"
  // setNumCasos(pastas.length);

  return pastas
};