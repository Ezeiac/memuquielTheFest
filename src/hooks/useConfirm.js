import supabase from '../supabaseClient';

const updateConfirmacion = async (tel, confirm) => {
  const { error } = await supabase
    .from('ConfirmacionInv')
    .update({ confirm })
    .eq('tel', tel); // Asumiendo que 'tel' es único

  if (error) {
    console.error('Error al actualizar confirmación:', error.message);
  }
};
