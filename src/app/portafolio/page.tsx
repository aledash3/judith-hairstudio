'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PortafolioItem {
  _id: string;
  tipoServicio: 'Corte' | 'Tinte' | 'Keratina' | 'Peinado' | 'Otros';
  descripcion?: string;
  fotoAntesUrl: string;
  fotoDespuesUrl: string;
  fechaCreacion: string;
}

export default function PortafolioPage() {
  const [items, setItems] = useState<PortafolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipoServicio, setTipoServicio] = useState('Corte');
  const [descripcion, setDescripcion] = useState('');
  const [fotoAntes, setFotoAntes] = useState<File | null>(null);
  const [fotoDespues, setFotoDespues] = useState<File | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const cargarPortafolios = async () => {
    try {
      const res = await fetch('/api/portafolio');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPortafolios();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const descripcionNormalizada = descripcion.trim();

    if (editandoId) {
      try {
        const res = await fetch(`/api/portafolio/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipoServicio, descripcion: descripcionNormalizada }),
        });
        if (!res.ok) throw new Error('Error al actualizar');
        alert('Portafolio actualizado correctamente.');
        resetFormulario();
        cargarPortafolios();
      } catch {
        alert('Error al actualizar.');
      }
    } else {
      if (!fotoAntes || !fotoDespues) {
        alert('Por favor selecciona ambas fotos (Antes y Después).');
        return;
      }

      const formData = new FormData();
      formData.append('tipoServicio', tipoServicio);
      formData.append('descripcion', descripcionNormalizada);
      formData.append('fotoAntes', fotoAntes);
      formData.append('fotoDespues', fotoDespues);

      try {
        const res = await fetch('/api/portafolio', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) throw new Error('Error al subir');
        alert('Trabajo optimizado con Sharp (WebP) y guardado con éxito.');
        resetFormulario();
        (e.target as HTMLFormElement).reset();
        cargarPortafolios();
      } catch {
        alert('Error al procesar y subir imágenes.');
      }
    }
  };

  const resetFormulario = () => {
    setEditandoId(null);
    setTipoServicio('Corte');
    setDescripcion('');
    setFotoAntes(null);
    setFotoDespues(null);
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar permanentemente este trabajo?')) {
      try {
        const res = await fetch(`/api/portafolio/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Elemento eliminado.');
          cargarPortafolios();
        }
      } catch {
        alert('Error al eliminar.');
      }
    }
  };

  // Exportar a Stories / TikTok 9:16 (1080x1920)
  const handleExportarVertical = async (item: PortafolioItem) => {
    try {
      const cargarImg = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = reject;
        });
      };

      const [imgAntes, imgDespues] = await Promise.all([
        cargarImg(item.fotoAntesUrl),
        cargarImg(item.fotoDespuesUrl),
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fondo
      ctx.fillStyle = '#1a1816';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mitadAlto = canvas.height / 2;

      const dibujarMitad = (img: HTMLImageElement, yInicio: number, label: string) => {
        const escala = Math.max(canvas.width / img.width, mitadAlto / img.height);
        const x = (canvas.width - img.width * escala) / 2;
        const y = yInicio + (mitadAlto - img.height * escala) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, yInicio, canvas.width, mitadAlto);
        ctx.clip();
        ctx.drawImage(img, x, y, img.width * escala, img.height * escala);

        // Etiqueta
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(40, yInicio + 40, 260, 70);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText(label, 70, yInicio + 90);
        ctx.restore();
      };

      dibujarMitad(imgAntes, 0, 'ANTES');
      dibujarMitad(imgDespues, mitadAlto, 'DESPUÉS');

      // Línea dorada divisoria
      ctx.strokeStyle = '#c08552';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(0, mitadAlto);
      ctx.lineTo(canvas.width, mitadAlto);
      ctx.stroke();

      // Marca de agua Judith HairStudio
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, canvas.height - 120, canvas.width, 120);
      ctx.fillStyle = '#dfd3c3';
      ctx.font = 'bold 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('JUDITH HAIRSTUDIO', canvas.width / 2, canvas.height - 48);

      // Descargar
      const link = document.createElement('a');
      link.download = `judith-historia-${item._id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error al generar la imagen vertical para redes sociales.');
    }
  };

  return (
    <div className="portafolio-view">
      <h1 className="page-title">Portafolio de Transformaciones</h1>

      {/* Formulario de Subida */}
      <div className="card form-card" style={{ marginBottom: '2.5rem' }}>
        <h2>{editandoId ? 'Editar Información de Trabajo' : 'Publicar Nueva Transformación'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid-forms">
            <div className="form-group">
              <label>Tipo de Técnica</label>
              <select
                value={tipoServicio}
                onChange={(e) => setTipoServicio(e.target.value)}
                required
              >
                <option value="Corte">Corte</option>
                <option value="Tinte">Tinte / Coloración</option>
                <option value="Keratina">Keratina / Alisado</option>
                <option value="Peinado">Peinado / Styling</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div className="form-group">
              <label>Descripción del Trabajo</label>
              <input
                type="text"
                placeholder="Ej. Alisado con keratina brasileña y sellado térmico"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>

          {!editandoId && (
            <div className="grid-forms" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Foto ANTES (Se convertirá a WebP)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFotoAntes(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Foto DESPUÉS (Se convertirá a WebP)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFotoDespues(e.target.files?.[0] || null)}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
            <button type="submit" className="btn btn-primary">
              {editandoId ? 'Guardar Cambios' : 'Subir & Optimizar'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-secondary" onClick={resetFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Grid de Trabajos */}
      <h2 className="section-title">Galería de Trabajos Realizados ({items.length})</h2>
      {loading ? (
        <p className="loading-state">Cargando portafolio...</p>
      ) : items.length === 0 ? (
        <p className="no-data">Aún no se han publicado transformaciones.</p>
      ) : (
        <div className="portfolio-grid">
          {items.map((item) => (
            <div key={item._id} className="portfolio-card">
              <div className="portfolio-images">
                <div className="image-wrapper">
                  <span className="image-badge">Antes</span>
                  <Image
                    src={item.fotoAntesUrl}
                    alt="Antes"
                    width={400}
                    height={220}
                    unoptimized
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                </div>
                <div className="image-wrapper">
                  <span className="image-badge badge-after">Después</span>
                  <Image
                    src={item.fotoDespuesUrl}
                    alt="Después"
                    width={400}
                    height={220}
                    unoptimized
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                </div>
              </div>

              <div className="portfolio-info" style={{ padding: '1.2rem' }}>
                <span className="badge badge-tipo">{item.tipoServicio}</span>
                <p style={{ margin: '0.8rem 0', color: 'var(--dark)', minHeight: '40px' }}>
                  {item.descripcion || 'Sin descripción adicional'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-sm btn-accent"
                    onClick={() => handleExportarVertical(item)}
                    title="Descargar imagen en 9:16 para Instagram y TikTok"
                  >
                    📱 Exportar a Stories
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setEditandoId(item._id);
                      setTipoServicio(item.tipoServicio);
                      setDescripcion(item.descripcion || '');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(item._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
