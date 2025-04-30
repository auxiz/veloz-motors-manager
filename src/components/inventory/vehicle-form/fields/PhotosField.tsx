
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VehicleFormData } from '../VehicleFormSchema';

interface PhotosFieldProps {
  form: UseFormReturn<VehicleFormData>;
}

export const PhotosField = ({ form }: PhotosFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const photos = form.watch('photos') || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      const newPhotos = [...photos];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('vehicle-photos')
          .upload(filePath, file);
          
        if (uploadError) {
          toast.error(`Erro ao enviar a foto: ${uploadError.message}`);
          console.error('Error uploading photo:', uploadError);
          continue;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('vehicle-photos')
          .getPublicUrl(filePath);
          
        newPhotos.push(publicUrl);
      }
      
      form.setValue('photos', newPhotos);
      toast.success('Fotos enviadas com sucesso!');
      
      // Reset the input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Ocorreu um erro ao fazer upload das fotos');
    } finally {
      setIsUploading(false);
    }
  };
  
  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    form.setValue('photos', newPhotos);
  };

  return (
    <FormField
      control={form.control}
      name="photos"
      render={() => (
        <FormItem className="col-span-2">
          <FormLabel>Fotos do Veículo</FormLabel>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer bg-veloz-black border-veloz-gray hover:border-veloz-yellow transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-veloz-yellow" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-veloz-yellow mb-2" />
                      <p className="text-xs text-veloz-white">Adicionar fotos</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  multiple 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
              
              {photos.map((photo, index) => (
                <Card key={index} className="relative w-32 h-32 bg-veloz-black border-veloz-gray overflow-hidden">
                  <img 
                    src={photo} 
                    alt={`Foto ${index + 1}`} 
                    className="object-cover w-full h-full" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Card>
              ))}
              
              {photos.length === 0 && !isUploading && (
                <CardContent className="flex items-center justify-center w-32 h-32 bg-veloz-black border-veloz-gray">
                  <Image className="w-8 h-8 text-veloz-gray" />
                </CardContent>
              )}
            </div>
            
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
