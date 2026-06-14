import { useState } from 'react';
import NuevaReservaPage from './NuevaReservaPage';
import MisReservasPage from './MisReservasPage';
import Footer from './Footer';
import '../estilos/reservas-page.css';

const TABS = [
  { id: 'nueva', label: 'Nueva Reserva' },
  { id: 'mis',   label: 'Mis Reservas'  },
];

export default function ReservasPage() {
  const [active, setActive] = useState('nueva');

  return (
    <>
    <div className="reservas-page">
      <div className="pill-nav-wrap">
        <div className="pill-nav">
          <div
            className="pill-indicator"
            style={{ transform: `translateX(${active === 'nueva' ? '0%' : '100%'})` }}
          />
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`pill-tab${active === tab.id ? ' active' : ''}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div key={active} className="tab-panel">
        {active === 'nueva' ? <NuevaReservaPage /> : <MisReservasPage />}
      </div>
    </div>
    <Footer />
    </>
  );
}
