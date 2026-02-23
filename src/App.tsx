// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import { useState, useEffect, useCallback, useRef } from "react";

// ─── TRIP DATA ────────────────────────────────────────────────────────────────
const TRIP_START = new Date("2026-08-02T05:00:00");

const CITIES = [
  {
    id: "madrid-transit", name: "Madrid", subtitle: "Tránsito", flag: "🇪🇸", emoji: "✈️",
    dates: "2 Agosto", nights: 0, budget: "moderado", color: "#c0392b", accent: "#e74c3c",
    transport: "Llegas a las 5 AM, vuelo a Lisboa a las 6 PM",
    days: [
      { day: "2 Agosto — Tránsito Madrid", slots: [
        { time:"5:00 AM", icon:"✈️", title:"Llegada T4 Barajas", desc:"Guarda maletas en taquillas de T4 (€5–8/maleta)." },
        { time:"6:00 AM", icon:"🚇", title:"Metro al centro", desc:"Línea 8 rosa → Sol. ~35 min, €5 tarifa aeropuerto." },
        { time:"7:00 AM", icon:"☕", title:"Desayuno madrileño auténtico", desc:"San Ginés: churros + chocolate ~€5. O tostada con tomate ~€2.50." },
        { time:"8:30 AM", icon:"🏛️", title:"Paseo histórico", desc:"Plaza Mayor → Sol → Retiro Park (gratis) → Mercado de San Miguel." },
        { time:"13:00", icon:"🍽️", title:"Menú del día", desc:"3 platos + bebida + postre: €12–15. Cocido madrileño o tortilla." },
        { time:"18:00", icon:"🛫", title:"Vuelo a Lisboa", desc:"¡Comienza la gran aventura!" },
      ]},
    ],
    gastronomy: ["Churros con chocolate","Tostada con tomate","Cocido Madrileño","Tortilla española","Vermú"],
    savings: ["Taquillas T4: €5–8/maleta","Metro aeropuerto: €5","Menú del día €12–15","Retiro Park gratis"],
    souvenirs: [],
    reservations: ["Confirmar terminal vuelo Madrid→Lisboa","Taquillas maletas T4 (sin reserva)"],
    shopping: [],
    budgetDay: 40,
  },
  {
    id:"lisboa", name:"Lisboa", subtitle:"La Ciudad de las Colinas", flag:"🇵🇹", emoji:"🐓",
    dates:"2–5 Agosto", nights:3, budget:"economico", color:"#2e86ab", accent:"#54a0d6",
    transport:"Vuelo Madrid → Lisboa ~1h20min. Llegada ~8 PM.",
    days:[
      { day:"Día 1 — 2 Agosto (Llegada nocturna)", slots:[
        { time:"20:00", icon:"🏨", title:"Check-in Mouraria o Alfama", desc:"El corazón auténtico de Lisboa." },
        { time:"21:00", icon:"🍷", title:"Bairro Alto / fado gratis", desc:"Ginjinha en A Ginjinha €1.50. Fado espontáneo en bares de Mouraria." },
      ]},
      { day:"Día 2 — 3 Agosto (Alfama)", slots:[
        { time:"8:00 AM", icon:"🏰", title:"Castelo de São Jorge", desc:"Vista épica del Tajo. Entrada €15." },
        { time:"10:00 AM", icon:"⛪", title:"Alfama + Sé Catedral", desc:"Callejuelas medievales. Sé: nave gratis." },
        { time:"11:00 AM", icon:"📷", title:"Miradouro das Portas do Sol", desc:"Mejor panorámica de Lisboa. Gratis." },
        { time:"13:00", icon:"🥪", title:"Tasca local", desc:"Bifana ~€2.50 o Prego ~€3. Con Sagres: €5–6 total." },
        { time:"15:00", icon:"🚋", title:"Tranvía 28", desc:"Lo más icónico de Lisboa. Billete €3 en parada." },
        { time:"17:00", icon:"🏭", title:"LX Factory", desc:"Ex fábrica con arte, tiendas y gastronomía." },
      ]},
      { day:"Día 3 — 4 Agosto (Belém)", slots:[
        { time:"9:30 AM", icon:"🗼", title:"Torre de Belém", desc:"El último paisaje de los navegantes. €6." },
        { time:"10:30 AM", icon:"🏛️", title:"Mosteiro dos Jerónimos", desc:"Obra maestra manuelina. €10." },
        { time:"12:30", icon:"🥐", title:"Pastéis de Belém ⭐ OBLIGATORIO", desc:"Receta secreta desde 1837. €1.35/unidad. Cómelos tibios con canela." },
        { time:"16:00", icon:"🏖️", title:"Cascais (excursión)", desc:"Tren ~40 min, €2.30. Villa costera perfecta." },
      ]},
      { day:"Día 4 — 5 Agosto (Chiado + Salida)", slots:[
        { time:"9:00 AM", icon:"🛒", title:"Mercado da Ribeira", desc:"Desayuno variado y productos portugueses." },
        { time:"10:30 AM", icon:"📚", title:"Chiado + Livraria Bertrand", desc:"Librería más antigua del mundo en funcionamiento (1732). Gratis." },
        { time:"PM", icon:"🛫", title:"Salida a Toulouse", desc:"Vuelo Lisboa → Toulouse desde €30." },
      ]},
    ],
    gastronomy:["Pastel de Nata","Bacalhau à Brás","Bifana","Prego","Caldo Verde","Ginjinha","Sardinhas Assadas","Ameijoas à Bulhão Pato","Vinho Verde"],
    savings:["Tranvía 28: €3 (vs taxi €15)","Miradores gratis: Portas do Sol, Graça, Santa Luzia","Ginjinha A Ginjinha: €1.50","Lisboa Card 48h: €34 transporte+museos","Fuentes agua potable en toda la ciudad","Prato do dia en tasca: €7–10"],
    souvenirs:["Azulejos originales (no aeropuerto)","Productos de corcho (bolso, billetera)","Galo de Barcelos desde €5","Ginjinha con vasito chocolate €8–12","Conservas de sardinas artísticas €3–8","Vinho Verde en Pingo Doce €3–6"],
    shopping:[
      { cat:"👟 Zapatos", tip:"Portugal tiene la mejor industria de calzado de cuero de Europa. En el Barrio de Alfama y la Rua Augusta encontrarás zapatos de cuero artesanal desde €40–80 (vs €200+ en otras capitales). Marcas locales como Fly London nacen aquí." },
      { cat:"🧴 Productos de corcho", tip:"Billeteras desde €8, bolsos desde €20, cinturones desde €15. El corcho portugués es el mejor del mundo (Portugal produce el 50% mundial). Busca en tiendas de Alfama, NO en el aeropuerto." },
      { cat:"🛒 Supermercado Pingo Doce", tip:"Vinos locales desde €2.50, aceite de oliva premium desde €4, conservas de sardinas decorativas desde €3. El mejor precio-calidad de Lisboa para llevarse productos gourmet." },
      { cat:"🎨 Mercado de Pulgas Feira da Ladra", tip:"Martes y sábados en Campo de Santa Clara. Ropa vintage, joyas de plata, azulejos antiguos, antigüedades. Precios desde €1. El mercado más auténtico de Lisboa." },
    ],
    reservations:["Vuelo Madrid→Lisboa","Hotel en Mouraria o Alfama","Mosteiro Jerónimos (verificar gratis 1er domingo)"],
    budgetDay:70,
  },
  {
    id:"toulouse", name:"Toulouse", subtitle:"La Ciudad Rosa", flag:"🇫🇷", emoji:"🌸",
    dates:"5–8 Agosto", nights:3, budget:"moderado", color:"#8e44ad", accent:"#9b59b6",
    transport:"Vuelo Lisboa→Toulouse ~1.5h. Tram T2 al centro: €1.80.",
    days:[
      { day:"Día 1 — 5 Agosto (Llegada)", slots:[
        { time:"Llegada", icon:"🏨", title:"Tram T2 al centro", desc:"Desde aeropuerto Blagnac: 25 min, €1.80." },
        { time:"Tarde", icon:"🏛️", title:"Place du Capitole", desc:"El corazón rosa de Toulouse. Interior de pinturas épicas: gratis." },
        { time:"Noche", icon:"🌊", title:"Canal du Midi al atardecer", desc:"Patrimonio UNESCO. Paseo romántico." },
      ]},
      { day:"Día 2 — 6 Agosto (Historia + Arte)", slots:[
        { time:"9:00 AM", icon:"⛪", title:"Basilique Saint-Sernin", desc:"Basílica románica más grande del mundo (s. XI–XII). Entrada gratuita." },
        { time:"10:30 AM", icon:"🏛️", title:"Couvent des Jacobins", desc:"La 'palmera de piedra' única en la arquitectura. €5." },
        { time:"13:00", icon:"🥖", title:"Mercado Victor Hugo", desc:"Donde comen los locales. Precios reales." },
        { time:"15:00", icon:"🚀", title:"Cité de l'Espace (opcional)", desc:"Réplicas ISS + cohete Ariane V. ~€22." },
      ]},
      { day:"Día 3 — 7 Agosto ⭐ CARCASSONNE", slots:[
        { time:"8:00 AM", icon:"🚄", title:"Tren a Carcassonne", desc:"1h, €15 ida/vuelta reservando en sncf-connect.com." },
        { time:"9:00 AM", icon:"🏰", title:"Cité de Carcassonne ⭐", desc:"Ciudad medieval amurallada más espectacular de Europa. 52 torres. UNESCO." },
        { time:"10:00 AM", icon:"🗺️", title:"Castillo Comtal + Murallas", desc:"€10. Vistas de los Pirineos al fondo. Medioevo puro." },
        { time:"13:00", icon:"🍲", title:"Cassoulet dentro de las murallas", desc:"El plato de Toulouse en su contexto. €15–20." },
        { time:"17:00", icon:"🚄", title:"Regreso a Toulouse", desc:"Tren de vuelta." },
      ]},
    ],
    gastronomy:["Cassoulet (LA especialidad)","Saucisse de Toulouse","Foie Gras","Magret de Canard","Violette de Toulouse","Crêpes","Croissant au Beurre","Armagnac"],
    savings:["Pícnic baguette+queso+vino desde Carrefour: €5–7 para dos","Mercado Victor Hugo para locales","Tren Carcassonne 30 días antes: €5–8 ida","Canal du Midi gratis","Saint-Sernin: entrada gratuita"],
    souvenirs:["Violette de Toulouse: jabones, perfumes, dulces","Cassoulet en lata artesanal","Armagnac — brandy del sur de Francia","Postal de Carcassonne"],
    shopping:[
      { cat:"👗 Ropa Outlet", tip:"El Village Outlet Toulouse en Pont-Rouge tiene marcas como Nike, Adidas, Tommy Hilfiger, Calvin Klein con 30–70% de descuento. A 15 min del centro en bus." },
      { cat:"🛒 Mercado del Capitole", tip:"Los miércoles y sábados en la Place du Capitole hay mercado con ropa, joyería artesanal y productos locales. Precios muy accesibles para Francia." },
      { cat:"🌸 Perfumes Violette", tip:"La violeta de Toulouse es la flor símbolo de la ciudad. Perfumes artesanales de alta calidad desde €15 vs €100+ en Paris. Busca La Maison de la Violette." },
      { cat:"🧀 Productos Gourmet", tip:"En el Mercado Victor Hugo: foie gras artesanal desde €12, Armagnac desde €18, quesos del sur de Francia. Mucho más barato que en tiendas de regalo." },
    ],
    reservations:["Vuelo/tren Lisboa→Toulouse","Hotel cerca de Place du Capitole","Tren Toulouse→Carcassonne (sncf-connect.com, 30 días antes)"],
    budgetDay:60,
  },
  {
    id:"paris", name:"París", subtitle:"La Ciudad Luz", flag:"🇫🇷", emoji:"🗼",
    dates:"8–11 Agosto", nights:3, budget:"caro", color:"#c0392b", accent:"#e74c3c",
    transport:"TGV Toulouse→Paris Montparnasse: ~4h15min, €40–80. Reservar 60 días antes.",
    days:[
      { day:"Día 1 — 8 Agosto (Torre Eiffel)", slots:[
        { time:"19:00", icon:"🛒", title:"Supermercado Monoprix", desc:"Baguette + brie + jambon + vin rouge ~€8. ¡La cena más parisina!" },
        { time:"20:00", icon:"🗼", title:"Pícnic Champ de Mars ⭐", desc:"Bajo la Torre Eiffel con vino y queso. Gratis y mágico." },
        { time:"22:00", icon:"✨", title:"Show de luces Torre Eiffel", desc:"Cada hora en punto en verano. 5 min de magia absoluta. Gratis." },
        { time:"22:30", icon:"📷", title:"Puente de Bir-Hakeim", desc:"La foto definitiva de la Torre Eiffel. El puente más fotogénico de París." },
      ]},
      { day:"Día 2 — 9 Agosto (Arte + Montmartre)", slots:[
        { time:"8:00 AM", icon:"🎨", title:"Louvre ⭐ (temprano)", desc:"Reserva online obligatoria €22. Gioconda → Venus de Milo → Victoria Samotracia." },
        { time:"11:00 AM", icon:"🕍", title:"Le Marais", desc:"Barrio histórico judío. Falafel en Rue des Rosiers ~€7." },
        { time:"14:00", icon:"⛪", title:"Sacré-Cœur Montmartre", desc:"Gratis. Vistas de todo París desde la cúpula." },
        { time:"16:00", icon:"🎭", title:"Place du Tertre", desc:"Artistas pintando en vivo. Bohemio puro. Gratis." },
      ]},
      { day:"Día 3 — 10 Agosto ⭐ VERSALLES", slots:[
        { time:"8:30 AM", icon:"🚆", title:"RER C a Versalles", desc:"~35 min, €4.50 ida. Llega al abrir (9 AM)." },
        { time:"9:00 AM", icon:"👑", title:"Château de Versailles ⭐", desc:"La residencia de Luis XIV–XVI. Galería de los Espejos: 357 espejos. €21." },
        { time:"11:00 AM", icon:"🌳", title:"Jardines de Versalles", desc:"67 hectáreas. Gratis (salvo domingos musicales ~€10)." },
        { time:"17:00", icon:"🚆", title:"Regreso a París", desc:"RER C de vuelta." },
      ]},
    ],
    gastronomy:["Croissant au beurre €1.20 (boulangerie)","Baguette tradition","Crêpes Nutella","Macarons Ladurée/Hermé","Steak Frites","Soupe à l'oignon","Quiche Lorraine","Escargots","Fromage variado"],
    savings:["Paris Museum Pass 4 días €70: Louvre+Versalles+Orsay+50 museos","Boulangerie local: croissant €1.20 (hotel: €4)","Picnics con Monoprix","RER C Versalles: €4.50 vs tour €80+","Metro carnet 10 viajes o Navigo día €8.65"],
    souvenirs:["Macarons Ladurée en caja","Mostaza Maille de Dijon €3–5","Libro en Bouquinistas del Sena","Mini Torre Eiffel latón desde €3","Pañuelo de seda en mercado vintage"],
    shopping:[
      { cat:"🏪 Marché aux Puces de Saint-Ouen", tip:"EL mercado de pulgas más grande del mundo (sabados y domingos, metro Porte de Clignancourt). Ropa vintage de diseñador, joyas antiguas, cuero y arte desde €5. Los profesionales de la moda vienen aquí. ¡El secreto de París!" },
      { cat:"👗 Zara, H&M, Mango en Les Halles", tip:"El centro comercial Westfield Forum des Halles tiene las mejores tiendas fast fashion del centro de París con precios europeos (más baratos que en Chile). Descuentos de temporada en agosto." },
      { cat:"💍 Joyas en Marais + Abbesses", tip:"Diseñadores independientes de joyería en Le Marais y Abbesses (Montmartre). Piezas únicas desde €15–40 que en Chile costarían €100+. Busca en Rue des Francs-Bourgeois." },
      { cat:"💄 Farmacia francesa (Pharmacie)", tip:"Las farmacias parisinas venden productos de belleza L'Occitane, La Roche-Posay, Avène, Bioderma, Embryolisse a precios regulados. 30–50% más barato que en Chile. Lleva lista." },
      { cat:"👠 Outlet Villages La Vallée", tip:"A 30 min del centro (RER A): outlet con Gucci, Burberry, Versace, Armani 30–70% de descuento. Para quienes buscan marcas de lujo. Vale el viaje si hay presupuesto." },
    ],
    reservations:["TGV Toulouse→Paris (sncf-connect.com, 60 días antes)","Hotel (11ème/6ème/5ème)","Torre Eiffel: ticket.toureiffel.paris","Louvre: ticketlouvre.fr","Versalles: chateauversailles.fr"],
    budgetDay:90,
  },
  {
    id:"zurich", name:"Zúrich", subtitle:"La Joya Suiza", flag:"🇨🇭", emoji:"🏔️",
    dates:"11–13 Agosto", nights:2, budget:"muy-caro", color:"#e74c3c", accent:"#c0392b",
    transport:"TGV Paris Gare de Lyon → Zurich HB: ~4h, €50–120. O vuelo ~1h15.",
    days:[
      { day:"Día 1 — 11 Agosto (Zúrich)", slots:[
        { time:"10:00 AM", icon:"⛪", title:"Grossmünster", desc:"Catedral s. XII. Donde predicó Zwinglio. Nave gratuita." },
        { time:"11:00 AM", icon:"🎨", title:"Fraumünster ⭐", desc:"Vidrieras de Marc Chagall. Colores únicos en el mundo. €5." },
        { time:"12:00", icon:"🛒", title:"Almuerzo en Migros/Coop", desc:"Sandwich + fruta + bebida: CHF 8–12. La clave para sobrevivir Suiza." },
        { time:"13:00", icon:"🏙️", title:"Bahnhofstrasse", desc:"La calle más cara del mundo. Caminarla es gratis." },
        { time:"15:00", icon:"🏊", title:"Lago de Zúrich ⭐", desc:"Los locales se bañan gratis en el lago. Seebad Utoquai ~€8." },
      ]},
      { day:"Día 2 — 12 Agosto ⭐ LUCERNA", slots:[
        { time:"8:30 AM", icon:"🚄", title:"Tren a Lucerna", desc:"50 min, CHF 23. O Swiss Day Pass CHF 58 (todo incluido)." },
        { time:"9:30 AM", icon:"🌉", title:"Kapellbrücke ⭐⭐", desc:"Puente cubierto más antiguo de Europa (s. XIV). Pinturas del s. XVII. Gratis." },
        { time:"10:30 AM", icon:"🏰", title:"Murallas medievales de Lucerna", desc:"Sube a las torres con vista al lago. Gratis." },
        { time:"14:00", icon:"⛴️", title:"Barco lago de los 4 Cantones", desc:"Vista de los Alpes desde el agua. CHF 10 tramo corto." },
        { time:"17:00", icon:"🚄", title:"Regreso a Zúrich", desc:"Última noche suiza." },
      ]},
    ],
    gastronomy:["Fondue de Queso","Raclette","Rösti","Zürcher Geschnetzeltes","Bratwurst con mostaza","Müesli original Bircher","Chocolate Lindt en Migros"],
    savings:["Migros y Coop: únicos supermercados económicos de Suiza","ZVV Card día transporte: CHF 8.80","Chocolate Lindt en Migros: CHF 3 (vs tienda €8)","Picnics en el lago","Kapellbrücke Lucerna: GRATIS"],
    souvenirs:["Chocolate Lindt/Sprüngli artesanal","Navaja Victorinox (tienda oficial)","Caja de música suiza desde €20","Queso Gruyère o Emmental al vacío","Miel de alpes CHF 8–12"],
    shopping:[
      { cat:"⚠️ Zúrich no es para compras baratas", tip:"Es la ciudad más cara del viaje. NO compres ropa, joyas ni electrónica aquí. Si necesitas algo, espera a Praga o Budapest donde los mismos artículos cuestan un 60–70% menos." },
      { cat:"🍫 Chocolate en Migros", tip:"La única compra que vale en Suiza. Lindt Excellence en Migros: CHF 3 (vs €8 en tienda especializada). Lleva varias tabletas — es el mejor chocolate del mundo al precio más razonable dentro de Suiza." },
      { cat:"⌚ Relojes suizos en Factory Outlets", tip:"Si el presupuesto es amplio: Frenkendorf Factory Outlet (a 20 min, IWC, Hamilton, Tissot) tiene relojes con 20–40% descuento. Tissot desde CHF 250 con garantía oficial." },
      { cat:"🎁 Migros para souvenirs gourmet", tip:"Compra miel de alpes, fondues en caja, chocolates y quesos en Migros. Mucho más barato que las tiendas turísticas. Un set fondue completo: CHF 15 vs CHF 45 en el aeropuerto." },
    ],
    reservations:["TGV Paris→Zurich o vuelo","Hotel (reservar temprano — Zúrich es carísimo)","Swiss Day Pass en sbb.ch para la excursión"],
    budgetDay:100,
  },
  {
    id:"venecia", name:"Venecia", subtitle:"La Ciudad Flotante", flag:"🇮🇹", emoji:"🎭",
    dates:"13–16 Agosto", nights:3, budget:"moderado", color:"#27ae60", accent:"#2ecc71",
    transport:"Tren Zurich HB → Venezia Santa Lucia: ~3h30min, €30–70. Llegas al Gran Canal.",
    days:[
      { day:"Día 1 — 13 Agosto (Llegada + Bacari)", slots:[
        { time:"Llegada", icon:"😲", title:"Primera vista del Gran Canal", desc:"Al salir de Santa Lucía: momento de vida. Tómate un minuto." },
        { time:"Tarde", icon:"🗺️", title:"PIÉRDETE ⭐", desc:"Sin GPS 2 horas. Descubre Venecia como los locales." },
        { time:"18:00", icon:"🌉", title:"Rialto Bridge al atardecer", desc:"700 años de historia. Gratis." },
        { time:"19:00", icon:"🍸", title:"Bacaro + Cicchetti ⭐", desc:"Spritz €3–4 + tapas venecianas €1–2 c/u. Lejos de San Marco." },
      ]},
      { day:"Día 2 — 14 Agosto (San Marco)", slots:[
        { time:"7:30 AM", icon:"🌅", title:"Plaza San Marco al amanecer ⭐", desc:"Sin turistas. La foto definitiva de Venecia. Magia pura." },
        { time:"8:30 AM", icon:"⛪", title:"Basílica de San Marco", desc:"Mosaico dorado del s. XI. Nave gratis. Reserva horario online." },
        { time:"10:00 AM", icon:"🏛️", title:"Palazzo Ducale ⭐", desc:"1,000 años de gobierno veneciano. Puente de los Suspiros. ~€30." },
        { time:"13:00", icon:"🍚", title:"Risotto al nero di seppia", desc:"En Dorsoduro, lejos de San Marco. €12–16 vs €22 en plaza." },
        { time:"16:00", icon:"⛵", title:"Traghetto — góndola de €2", desc:"Los locales cruzan el Gran Canal por €2. Góndola turística cuesta €80." },
      ]},
      { day:"Día 3 — 15 Agosto ⭐ MURANO + BURANO", slots:[
        { time:"8:00 AM", icon:"⛴️", title:"Vaporetto a Murano", desc:"Línea 12/13 desde Fondamenta Nove. Pase día €25." },
        { time:"9:00 AM", icon:"🔥", title:"Murano — soplado de vidrio", desc:"Demostración GRATUITA en fabbrica. Arte de 700 años en vivo." },
        { time:"11:00 AM", icon:"🌈", title:"Burano ⭐⭐ (temprano = sin turistas)", desc:"La isla más colorida del mundo. Llega antes de las 11 AM." },
        { time:"15:00", icon:"👻", title:"Torcello — la isla fantasma", desc:"S. VII, casi despoblada. Catedral con mosaicos bizantinos del s. XI." },
      ]},
    ],
    gastronomy:["Cicchetti (tapas venecianas €1–2)","Sarde in saor","Risotto al nero di seppia","Baccalà mantecato","Fritto misto","Spritz Aperol/Campari","Tiramisu original"],
    savings:["Bacari lejos de San Marco: cicchetti €1 vs €4 en plaza","Agua potable gratis en fontanelle","Traghetto €2 vs góndola €80","Plaza San Marco gratis","Reserva Basílica San Marco online: sin cola"],
    souvenirs:["Vidrio de Murano con sello 'Vetro Artistico Murano'","Máscara Carnaval artesanal (taller en Dorsoduro)","Papel marmolado (carta marmorizzata)","Encaje de Burano hecho a mano"],
    shopping:[
      { cat:"💍 Joyas de vidrio de Murano", tip:"En la isla de Murano directamente: collares, aretes y pulseras de vidrio soplado desde €8–25 (vs €60–120 en tiendas de San Marco). Busca con sello 'Vetro Artistico Murano'. Las piezas sin sello son imitaciones chinas." },
      { cat:"🛍 Mercado de Rialto (mañanas)", tip:"El mercado que rodea el Puente de Rialto en las mañanas vende bisutería, pañuelos de seda y artesanía local a precios razonables. Rebaja a partir de las 11 AM cuando los comerciantes quieren cerrar." },
      { cat:"📿 Encaje de Burano", tip:"Las maestras encajeras de Burano hacen encaje a mano (merletto buranello). Una pieza pequeña desde €20. Auténtico, hecho por las últimas artesanas de la isla. El mejor souvenir-joya de Venecia." },
      { cat:"🎨 Máscaras artesanales vs baratas", tip:"EVITA las máscaras de plástico chino (€5–10) que venden en todas las esquinas. Los talleres artesanales en Dorsoduro y Cannaregio tienen máscaras de papel maché pintadas a mano desde €25–40. Duran décadas." },
    ],
    reservations:["Tren Zurich→Venezia (trenitalia.com)","Hotel en Dorsoduro o Cannaregio","Basílica San Marco: veneziaunica.it (gratis, sin cola)","Palazzo Ducale: palazzoducale.visitmuve.it"],
    budgetDay:80,
  },
  {
    id:"garda", name:"Lago di Garda", subtitle:"El Mediterráneo Alpino", flag:"🇮🇹", emoji:"🌊",
    dates:"16–19 Agosto", nights:3, budget:"economico", color:"#16a085", accent:"#1abc9c",
    transport:"Tren Venezia → Desenzano del Garda: ~1h, €10–15.",
    days:[
      { day:"Día 1 — 16 Agosto (Sirmione)", slots:[
        { time:"10:00 AM", icon:"🏰", title:"Rocca Scaligera", desc:"Castillo medieval s. XIII. €6. Sirmione parece imposible." },
        { time:"12:00", icon:"🏛️", title:"Grotte di Catullo", desc:"Villa romana más grande del norte de Italia (s. I d.C.). ~€6." },
        { time:"14:00", icon:"♨️", title:"Lido delle Bionde", desc:"Aguas termales naturales del lago. Baño termal. €12–15." },
        { time:"19:00", icon:"⛵", title:"Puerto de Sirmione al atardecer", desc:"Veleros, montañas y luz de agosto. Postal perfecta." },
      ]},
      { day:"Día 2 — 17 Agosto (Ferry + Lago)", slots:[
        { time:"9:00 AM", icon:"⛴️", title:"Ferry Lago di Garda", desc:"Pase día €25–30. Navega el fiordo italiano." },
        { time:"10:30 AM", icon:"🍋", title:"Limone sul Garda ⭐", desc:"Pueblo de limoneros colgado en la roca. Instagram imposible." },
        { time:"13:00", icon:"🏰", title:"Malcesine — pueblo medieval", desc:"En el extremo norte del lago." },
        { time:"15:00", icon:"🚡", title:"Teleférico Monte Baldo ⭐", desc:"€26 ida/vuelta. El lago entero + Alpes desde arriba." },
      ]},
      { day:"Día 3 — 18 Agosto ⭐ VERONA", slots:[
        { time:"9:00 AM", icon:"🚄", title:"Tren a Verona", desc:"30 min desde Desenzano, ~€5." },
        { time:"9:30 AM", icon:"🏛️", title:"Arena di Verona ⭐", desc:"Anfiteatro romano año 30 d.C. 3ro más grande del mundo. €12 diurno." },
        { time:"11:00 AM", icon:"💘", title:"Casa di Giulietta", desc:"El balcón de Shakespeare. €6. Foto obligatoria." },
        { time:"12:30", icon:"🍸", title:"Aperol Spritz en Piazza Bra", desc:"Frente a la Arena. El aperitivo más icónico de Italia." },
        { time:"20:30", icon:"🎭", title:"Ópera en la Arena (opcional) ⭐⭐", desc:"arena.it. Gradas de piedra desde €25. Único en el mundo." },
      ]},
    ],
    gastronomy:["Lavarello del lago","Risotto al pesce","Aceite DOP del Garda","Bardolino DOC","Lugana bianco","Limoncello de Garda","Amarone della Valpolicella"],
    savings:["Playas públicas gratis: Manerba, Moniga, Peschiera","Desenzano más barato que Sirmione","Picnic Esselunga: Grana Padano + vino local","Tren Desenzano→Verona: €5 (vs taxi €60)"],
    souvenirs:["Aceite de oliva DOP del Garda","Bardolino DOC — vino tinto ligero del lago","Limoncello de Limone sul Garda (el auténtico)","Cremas y jabones de limón artesanales"],
    shopping:[
      { cat:"👗 Outlet Factory Franciacorta", tip:"A 20 min de Desenzano: el outlet más grande del norte de Italia con Prada, Gucci, Armani, Boss, Nike, con 30–70% descuento. Un must para compras. Transporte en autobús lanzadera desde Brescia." },
      { cat:"🛍 Mercado de Desenzano del Garda", tip:"Martes por la mañana: mercado semanal con ropa italiana, artesanía local, verduras y productos gourmet. Los lugareños vienen aquí. Precios italianos reales." },
      { cat:"🍋 Productos de limón de Limone", tip:"Directamente en el pueblo de Limone sul Garda: limoncello artesanal (CHF 8–12), mermeladas de limón, cremas corporales. El limoncello de aquí es DOP, muy diferente al industrial." },
      { cat:"🥂 Vino Bardolino y Lugana", tip:"En bodegas locales (cantine) en las orillas del lago puedes comprar directamente al productor. Una botella de Bardolino DOC: €5–8 (vs €15–20 en restaurant). Muchas bodegas tienen degustación gratuita." },
    ],
    reservations:["Tren Venezia→Desenzano (trenitalia.com)","Hotel en Desenzano del Garda","Ópera Arena Verona: arena.it (si quieres ir)"],
    budgetDay:65,
  },
  {
    id:"praga", name:"Praga", subtitle:"La Ciudad de las Cien Torres", flag:"🇨🇿", emoji:"🏰",
    dates:"19–23 Agosto", nights:4, budget:"economico", color:"#d35400", accent:"#e67e22",
    transport:"Vuelo Verona → Praga ~1h30min (Ryanair, Wizz). Reservar 60 días.",
    days:[
      { day:"Día 1 — 19 Agosto (Staré Město)", slots:[
        { time:"10:00 AM", icon:"🕰️", title:"Reloj Astronómico (Orloj) ⭐", desc:"Espectáculo gratis cada hora en punto. Torre €10." },
        { time:"11:00 AM", icon:"🏙️", title:"Staroměstské náměstí", desc:"La plaza más bella de Europa central. Gratis." },
        { time:"13:00", icon:"🕍", title:"Josefov — Barrio judío", desc:"6 sinagogas + cementerio más antiguo de Europa. Combinado €15." },
        { time:"19:00", icon:"🌉", title:"Puente Carlos al atardecer", desc:"30 estatuas barrocas. Con Castillo iluminado al fondo. Gratis." },
      ]},
      { day:"Día 2 — 20 Agosto (Castillo)", slots:[
        { time:"6:30 AM", icon:"🌅", title:"Hradčany al amanecer ⭐⭐", desc:"Abre a las 6 AM. El castillo más grande del mundo al amanecer. Momento de vida." },
        { time:"7:00 AM", icon:"⛪", title:"Catedral de San Vito", desc:"Gótico del s. XIV con vidrieras de Mucha. El alma de Bohemia." },
        { time:"9:00 AM", icon:"🏠", title:"Callejón del Oro (Zlatá ulička)", desc:"Donde vivían alquimistas del rey. Kafka vivió aquí. ~€15." },
        { time:"11:00 AM", icon:"🌉", title:"Puente Carlos — antes de las 10 AM", desc:"Foto sin multitudes. Baja desde el Castillo por Malá Strana." },
      ]},
      { day:"Día 3 — 21 Agosto (Vyšehrad + Žižkov)", slots:[
        { time:"10:00 AM", icon:"🏰", title:"Vyšehrad", desc:"2do castillo de Praga. Cementerio de Dvořák y Smetana. Místico." },
        { time:"13:00", icon:"🍺", title:"Menú del día en Vinohrady", desc:"CZK 150–200 (~€6–8). El barrio local de Praga." },
        { time:"16:00", icon:"📡", title:"Torre de TV Žižkov", desc:"Bebés gigantes de Černý trepando. Vista 360° de Praga. ~€14." },
      ]},
      { day:"Día 4 — 22 Agosto ⭐ ČESKÝ KRUMLOV", slots:[
        { time:"8:00 AM", icon:"🚌", title:"Bus a Český Krumlov", desc:"Student Agency/FlixBus: ~3h, €10–15 ida/vuelta." },
        { time:"11:00 AM", icon:"🏰", title:"Český Krumlov ⭐⭐", desc:"UNESCO completo. Muchos lo dicen más impresionante que Praga. Imposible de olvidar." },
        { time:"14:00", icon:"🚶", title:"Ciudad baja medieval", desc:"Calles empedradas, pubs medievales, artesanía local." },
        { time:"20:00", icon:"🚌", title:"Último bus de regreso", desc:"Reserva con anticipación." },
      ]},
    ],
    gastronomy:["Svíčková na smetaně (ternera en crema)","Vepřo-knedlo-zelo","Koleno asado €8–12","Pilsner Urquell €1.40–2/pinta","Kozel negro","Trdelník","Bramborák","Becherovka"],
    savings:["Pilsner Urquell más barato que agua: CZK 35–50 (€1.40–2)","Menú mediodía Vinohrady: CZK 150–200 (€6–8)","Pase 24h metro/tram: CZK 120 (€5)","Usar cajero banco local (NO casa de cambio)"],
    souvenirs:["Cristal de Bohemia (Moser o Rückl)","Granates checos (con certificado autenticidad)","Becherovka — licor de hierbas único","Marionetas de madera artesanales","Absinthe checo €8–15"],
    shopping:[
      { cat:"💍 JOYAS MÁS BARATAS DEL VIAJE", tip:"Praga es el lugar más económico para comprar joyería de calidad. Granates checos (červené granáty): el souvenir-joya más preciado, rojo oscuro, en plata 925. Aretes desde €15, collares desde €25. En tiendas certificadas de Celetná y Wenceslao. La mitad del precio que en Europa occidental." },
      { cat:"👗 Ropa en Palladium Mall", tip:"El centro comercial Palladium (metro Náměstí Republiky) tiene las mismas marcas que Europa occidental (Zara, H&M, Mango, Tommy Hilfiger) con precios un 15–25% más bajos que en París o Madrid. En agosto hay saldos de verano." },
      { cat:"🔮 Cristal de Bohemia", tip:"En tiendas de Malá Strana y Staré Město: copas, jarrones y figuras de cristal soplado. Una copa fina de cristal bohemio cuesta €8–15 (vs €40+ en Austria o Alemania). Verifica que sea cristal checo de Moser o Rückl, no vidrio asiático." },
      { cat:"🛍 Havelský Market (diario)", tip:"El mercado al aire libre más auténtico de Praga (entre Celetná y Wenceslao, abierto todos los días). Ropa, artesanía, ámbar báltico (desde €5), cerámica pintada. Mucho más barato que las tiendas del casco histórico." },
      { cat:"🧸 Marionetas artesanales", tip:"Praga tiene una tradición centenaria de marionetas (loutky). Talleres en Malá Strana y Nerudova Street. Una marioneta artesanal de madera: €15–40. Las de plástico en los quioscos no son las mismas." },
    ],
    reservations:["Vuelo Verona→Praga (Ryanair/Wizz, 60 días antes)","Hotel Staré Město o Vinohrady","Bus Praga→Český Krumlov (studentagency.eu)"],
    budgetDay:50,
  },
  {
    id:"budapest", name:"Budapest", subtitle:"La Perla del Danubio", flag:"🇭🇺", emoji:"🌉",
    dates:"23–26 Agosto", nights:3, budget:"economico", color:"#8e44ad", accent:"#9b59b6",
    transport:"FlixBus Praga→Budapest: ~4h30min, €15–25. O tren ~6h30min.",
    days:[
      { day:"Día 1 — 23 Agosto (BUDA)", slots:[
        { time:"10:00 AM", icon:"🚡", title:"Funicular Sikló", desc:"€5 subida/bajada. O sube a pie gratis." },
        { time:"10:30 AM", icon:"⛪", title:"Iglesia de Matías ⭐", desc:"Coronaciones reales húngaras. Interior medieval único. ~€5." },
        { time:"11:00 AM", icon:"🏰", title:"Bastión de los Pescadores ⭐⭐", desc:"GRATIS antes de las 9 PM en verano. Las mejores vistas de Budapest." },
        { time:"20:00", icon:"🌉", title:"Puente de las Cadenas iluminado ⭐", desc:"Leones de piedra + Danubio + Castillo = magia. Gratis." },
      ]},
      { day:"Día 2 — 24 Agosto (PEST)", slots:[
        { time:"9:00 AM", icon:"🏛️", title:"Parlamento Húngaro ⭐", desc:"3ro más grande del mundo. Reserva online ~€15." },
        { time:"11:00 AM", icon:"⛪", title:"Basílica de San Esteban", desc:"Cúpula ~€5. La mano momificada del rey del año 1000 d.C." },
        { time:"15:00", icon:"🏛️", title:"Hősök tere + Városliget", desc:"Plaza de los Héroes (gratis) + Castillo Vajdahunyad." },
      ]},
      { day:"Día 3 — 25 Agosto (Termas + Ruin Bars)", slots:[
        { time:"9:00 AM", icon:"♨️", title:"Széchenyi Thermal Bath ⭐⭐", desc:"Balneario de 1913. Piscinas termales al aire libre. ~€22 online." },
        { time:"12:00", icon:"🛒", title:"Nagy Vásárcsarnok ⭐", desc:"Mercado Central 1897. Mejor lángos ~€2. Souvenirs más baratos de Budapest." },
        { time:"15:00", icon:"🕍", title:"Gran Sinagoga Dohány", desc:"La más grande de Europa. €15." },
        { time:"18:00", icon:"🍺", title:"Szimpla Kert — El Ruin Bar ⭐", desc:"El ruin bar más famoso del mundo. La noche más auténtica de Budapest." },
      ]},
    ],
    gastronomy:["Gulyás — EL plato húngaro","Lángos con crema y queso ~€2","Kürtőskalács","Halászlé","Palacsinta","Dobos torta","Tokaji Aszú (vino de reyes)","Pálinka","Unicum"],
    savings:["Lángos del Mercado Central: 600–800 HUF (~€2)","Ebédmenü: 1.500–2.500 HUF (~€4–7)","Bastión GRATIS antes de las 9 PM","Széchenyi online: €22 vs €30 caja","Cerveza Dreher local: 400–600 HUF (~€1)"],
    souvenirs:["Paprika húngara en lata decorativa €3–8","Tokaji Aszú (0.5L) en el Mercado Central","Pálinka artesanal de ciruela o albaricoque","Porcelana Herend desde €25","Bordados de Kalocsa","Unicum — botella redonda"],
    shopping:[
      { cat:"💍 JOYAS MÁS BARATAS DESPUÉS DE PRAGA", tip:"Budapest tiene joyería artesanal a precios increíbles. Porcelana Herend (tazas, figurillas) desde €15 en el mercado. Bordados y telas de Kalocsa bordadas a mano: manteles desde €10, pañuelos desde €3. Artesanía folk húngara: genuina y única." },
      { cat:"🛒 Nagy Vásárcsarnok (Mercado Central)", tip:"EL lugar de compras de Budapest. 2do piso: souvenirs más baratos de la ciudad. Paprika decorativa €3, bordados €5–15, salami Pick (famosísimo) al vacío €8–12. Mejor que cualquier tienda turística. Lunes-sábado." },
      { cat:"👗 Fashion Street (Váci utca)", tip:"La calle peatonal más comercial de Budapest. H&M, Zara, Mango con precios más bajos que Europa occidental (~10–20%). También tiendas locales con diseño húngaro único desde €15." },
      { cat:"🥾 Cuero húngaro", tip:"Hungría tiene una tradición de cuero artesanal de calidad. Cinturones, bolsos y carteras de cuero genuino desde €15–30 en el mercado Ecseri (mercado de pulgas, sábados) — el más grande de Europa central." },
      { cat:"🏺 Mercado Ecseri Flea Market", tip:"Sábados y domingos en el sur de Budapest (bus 54 desde Boráros tér). Antigüedades, objetos comunistas, ropa vintage, joyas de plata húngaras. Precios de ganga desde €1. Los coleccionistas europeos vienen aquí." },
    ],
    reservations:["FlixBus Praga→Budapest (flixbus.com)","Hotel Pest 5to u 8vo distrito","Parlamento: jegy.parlament.hu (OBLIGATORIO)","Széchenyi: szechenyibath.com (ahorra €8)"],
    budgetDay:45,
  },
  {
    id:"montenegro", name:"Montenegro", subtitle:"La Joya Escondida del Adriático", flag:"🇲🇪", emoji:"⛵",
    dates:"26–29 Agosto", nights:3, budget:"muy-economico", color:"#c0392b", accent:"#e74c3c",
    transport:"Vuelo Budapest → Tivat: ~1h30min, Wizz Air desde €30–60.",
    days:[
      { day:"Día 1 — 26 Agosto (Kotor)", slots:[
        { time:"Llegada", icon:"😱", title:"Primera vista de la Bahía", desc:"Al aterrizar en Tivat verás montañas de 1.800m que caen al mar. Imposible de describir." },
        { time:"Tarde", icon:"🏰", title:"Stari Grad de Kotor ⭐", desc:"Murallas venecianas s. IX, callejuelas medievales y gatos por todos lados." },
        { time:"17:00", icon:"🏔️", title:"Fortaleza de San Juan ⭐⭐", desc:"~1.350 escalones en la roca. €8. El mejor atardecer del viaje. Lleva agua." },
        { time:"21:00", icon:"🍷", title:"Konoba local para cenar", desc:"Pršut + queso njeguški + Vranac: €8–12 para dos." },
      ]},
      { day:"Día 2 — 27 Agosto (Bahía + Perast)", slots:[
        { time:"9:00 AM", icon:"⛴️", title:"Ferry/taxi a Perast", desc:"~€5–8/persona. La Bahía de Kotor: el fiordo más austral de Europa." },
        { time:"10:00 AM", icon:"🏛️", title:"Perast ⭐", desc:"17 palacios barrocos del s. XVII en 500 metros. El pueblo más elegante de Montenegro." },
        { time:"11:30 AM", icon:"⛪", title:"Gospa od Škrpjela ⭐⭐", desc:"Isla artificial construida piedra a piedra por pescadores en 500 años. 2.300 pinturas votivas." },
        { time:"14:00", icon:"🚌", title:"Bus a Herceg Novi", desc:"Bus local €1–2. Ciudadela + vistas de la entrada al fiordo." },
      ]},
      { day:"Día 3 — 28 Agosto (Budva + Sveti Stefan)", slots:[
        { time:"9:00 AM", icon:"🚌", title:"Bus Kotor→Budva", desc:"40 min, €2." },
        { time:"10:00 AM", icon:"🏰", title:"Stari Grad de Budva", desc:"Ciudadela medieval en península rodeada de mar." },
        { time:"14:00", icon:"🏝️", title:"Sveti Stefan ⭐⭐⭐ FOTO OBLIGATORIA", desc:"El paisaje más fotografiado de los Balcanes. No puedes entrar (hotel de lujo), pero la vista es de película." },
        { time:"17:00", icon:"🏖️", title:"Playa libre junto a Sveti Stefan", desc:"Arena, agua cristalina y el islote de fondo. GRATIS." },
      ]},
    ],
    gastronomy:["Ćevapi","Njeguški pršut (jamón ahumado)","Queso njeguški fresco","Riblja čorba","Mariscos a la brasa","Vranac (vino autóctono)","Rakija/lozovača","Priganice"],
    savings:["Montenegro el más barato: café €1, cerveza €1.50, pizza €5–8","Bus Kotor→Budva: €2 (vs taxi €20)","Konobas locales: tabla pršut+queso+vino €8–12","Playas públicas: GRATIS","Mercados locales de frutas: centavos"],
    souvenirs:["Njeguški pršut al vacío (jamón único de Montenegro)","Vino Vranac de Plantaže","Rakija artesanal de uva","Joyería de filigrana de plata de Kotor","Aceite de oliva de la bahía de Boka","Imán de Sveti Stefan o Kotor"],
    shopping:[
      { cat:"💍 Filigrana de plata de Kotor", tip:"Los joyeros de Kotor tienen siglos de tradición en filigrana de plata (trabajo de hilo de plata trenzado). Aretes de filigrana desde €12, collares desde €20. Artesanía balcánica única que no encontrarás en ningún otro lugar del viaje." },
      { cat:"🛒 Precios más baratos del viaje", tip:"Montenegro es el país más económico del recorrido. Ropa de playa (bikinis, camisetas, pareos) en los mercados de Budva desde €3–8. Sandalias de cuero desde €10. Todo lo que necesites para el calor de agosto a precios increíbles." },
      { cat:"🍷 Vino Vranac directo de bodega", tip:"La bodega Plantaže cerca de Podgorica permite visitas con degustación. Pero en Kotor, tiendas de vino local venden Vranac de calidad desde €5 la botella (vs €15 en restaurante). Lleva varias botellas — solo aquí consigues Vranac auténtico." },
      { cat:"🧿 Artesanía local del mercado Kotor", tip:"Frente a las murallas de Kotor hay un mercado diario de artesanía con joyas de plata, bordados montenegrinos, cerámicas pintadas con motivos del Adriático. Precios desde €3. Los vendedores son negociables." },
    ],
    reservations:["Vuelo Budapest→Tivat (Wizz Air, 60 días antes)","Alojamiento en Kotor casco antiguo","Sin reservas especiales — Montenegro es espontáneo"],
    budgetDay:40,
  },
  {
    id:"madrid-final", name:"Madrid", subtitle:"El Gran Cierre", flag:"🇪🇸", emoji:"🐂",
    dates:"29–31 Agosto", nights:2, budget:"moderado", color:"#c0392b", accent:"#e74c3c",
    transport:"Vuelo Montenegro→Madrid: ~3–5h total, €50–120.",
    days:[
      { day:"Día 1 — 29 Agosto (Arte)", slots:[
        { time:"9:00 AM", icon:"🎨", title:"Museo del Prado ⭐⭐", desc:"Velázquez, Goya, El Greco. Las Meninas, Los Fusilamientos. €15. Gratis 6–8 PM." },
        { time:"12:30", icon:"🎨", title:"Museo Reina Sofía ⭐⭐", desc:"El Guernica de Picasso en sala completa. ~€12. Gratis lunes y domingos." },
        { time:"15:00", icon:"🌳", title:"Parque del Retiro", desc:"300 acres gratuitos. Lago + Palacio de Cristal (exposiciones gratis)." },
        { time:"20:00", icon:"🍢", title:"Tapas en La Latina", desc:"Calle Cava Baja. Patatas bravas, croquetas, jamón. €2–4/tapa." },
      ]},
      { day:"Día 2 — 30 Agosto (Último día europeo)", slots:[
        { time:"9:30 AM", icon:"👑", title:"Palacio Real de Madrid ⭐", desc:"Residencia oficial más grande de Europa: 3.418 habitaciones. ~€14." },
        { time:"13:00", icon:"🍽️", title:"ÚLTIMO menú del día europeo", desc:"Cocido madrileño. 3 platos + bebida + postre + café: €13–16." },
        { time:"15:00", icon:"🛍️", title:"Mercado de San Miguel ⭐", desc:"Estructura de hierro 1916. Jamón ibérico, quesos, aceitunas. Último bocado gourmet." },
        { time:"22:00", icon:"🍫", title:"Churros San Ginés — Despedida", desc:"Abierto 24h. El final perfecto de 29 días en Europa. €4–5." },
      ]},
    ],
    gastronomy:["Churros con chocolate (San Ginés, 24h)","Bocadillo de calamares","Cocido Madrileño","Jamón Ibérico de Bellota","Tortilla española","Patatas Bravas","Croquetas","Vermú","Rioja Reserva"],
    savings:["Prado y Reina Sofía gratis en horario especial","Menú del día €13–16 (3 platos+bebida+postre+café)","Retiro Park y Palacio de Cristal: GRATIS","Metro día completo: €10"],
    souvenirs:["Jamón Ibérico de Bellota al vacío","Aceite de oliva virgen extra DOP (El Corte Inglés Gourmet)","Queso Manchego curado al vacío","Azafrán La Mancha DOP","Turrón de Jijona","Cerámica de Talavera"],
    shopping:[
      { cat:"🛍 El Rastro — El mercado más famoso de España", tip:"Domingos de 9 AM a 3 PM en La Latina. El mercado de pulgas más conocido de España: ropa vintage, cuero, joyas de plata, antigüedades, objetos únicos. Desde €1. Después visita los bares de La Latina para el vermú tradicional." },
      { cat:"👗 Zara — la tienda más barata en su país de origen", tip:"Zara nació en España (Inditex es gallega). Los precios en España son los más bajos del mundo para Zara: 10–20% más baratos que en Chile. La tienda principal de Gran Vía es impresionante." },
      { cat:"💄 Mercadona para belleza española", tip:"Productos de belleza de la marca propia de Mercadona (Deliplus) son excelentes y muy baratos: cremas, shampoos, perfumes desde €2–5. Los españoles los adoran y muchos turistas los llevan por cajas." },
      { cat:"👠 Cuero español", tip:"España tiene la segunda mejor industria de calzado de cuero después de Italia (Camper, Pikolinos, Pertini son españolas). En El Rastro encuentras botas y zapatos de cuero genuino desde €20–40. En tiendas: Camper outlet tiene descuentos de temporada de agosto." },
      { cat:"🥃 Gourmet en El Corte Inglés Gourmet", tip:"La planta de alimentación del Corte Inglés en Callao/Sol tiene el mejor jamón ibérico, quesos y aceites de España. Jamón ibérico de bellota al vacío: €15–20 (vs €50+ en el aeropuerto). Imprescindible para llevar a Chile." },
    ],
    reservations:["Vuelo Montenegro→Madrid","Hotel en Madrid (cerca de Sol o Malasaña)","Palacio Real: entradapalacioreal.es","Verificar horarios gratuitos museos"],
    budgetDay:70,
  },
];

const BUDGET_BADGE = {
  "muy-economico": { label:"Muy Económico 💚", bg:"rgba(39,174,96,0.18)", color:"#27ae60" },
  "economico":     { label:"Económico 💚",      bg:"rgba(39,174,96,0.12)", color:"#27ae60" },
  "moderado":      { label:"Moderado 🟡",        bg:"rgba(241,196,15,0.15)", color:"#f39c12" },
  "caro":          { label:"Caro 🔴",            bg:"rgba(231,76,60,0.15)", color:"#e74c3c" },
  "muy-caro":      { label:"Muy Caro 🔴🔴",      bg:"rgba(192,57,43,0.2)",  color:"#c0392b" },
};

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────
function Countdown() {
  const [t, setT] = useState({ d:0, h:0, m:0, s:0 });
  useEffect(() => {
    const tick = () => {
      const diff = TRIP_START - new Date();
      if (diff <= 0) return;
      setT({ d:Math.floor(diff/86400000), h:Math.floor(diff%86400000/3600000), m:Math.floor(diff%3600000/60000), s:Math.floor(diff%60000/1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
      {[["Días",t.d],["Hrs",t.h],["Min",t.m],["Seg",t.s]].map(([l,v])=>(
        <div key={l} style={{background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.35)",borderRadius:"10px",padding:"12px 16px",textAlign:"center",minWidth:"65px"}}>
          <div style={{fontSize:"26px",fontWeight:"900",color:"#C9A84C",fontFamily:"monospace",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
          <div style={{fontSize:"10px",color:"#8b949e",textTransform:"uppercase",letterSpacing:"1px",marginTop:"3px"}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ─── PHOTO UPLOAD HELPER ──────────────────────────────────────────────────────
function resizeImage(file, maxW=800, maxH=600) {
  return new Promise(res => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h*maxW/w); w = maxW; }
        if (h > maxH) { w = Math.round(w*maxH/h); h = maxH; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        res(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── Navigation
  const [view, setView] = useState("home");
  const [selectedCity, setSelectedCity] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [activeTab, setActiveTab] = useState("itinerary");

  // ── Persistent state
  const [expenses, setExpenses] = useState([]);
  const [reservChecked, setReservChecked] = useState({});
  const [packChecked, setPackChecked] = useState({});
  const [souvenirChecked, setSouvenirChecked] = useState({});
  const [visitedSlots, setVisitedSlots] = useState({});   // { "cityId|slotTitle": true }
  const [photos, setPhotos] = useState([]);               // [{ id, cityId, cityName, flag, dataUrl, review, date, rating }]

  // ── Expense input
  const [expInput, setExpInput] = useState({ city:"", cat:"Comida", desc:"", amount:"" });

  // ── Photo/blog input
  const [photoInput, setPhotoInput] = useState({ cityId:"", review:"", rating:5, dataUrl:"" });
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileRef = useRef();

  // ── Storage
  const save = useCallback(async (key, val) => {
    try { await window.storage.set(key, JSON.stringify(val)); } catch(e) {}
  }, []);

  useEffect(() => {
    (async () => {
      const loads = [
        ["expenses", setExpenses],["reservChecked", setReservChecked],
        ["packChecked", setPackChecked],["souvenirChecked", setSouvenirChecked],
        ["visitedSlots", setVisitedSlots],["photos", setPhotos],
      ];
      for (const [k,setter] of loads) {
        try { const r = await window.storage.get(k); if(r) setter(JSON.parse(r.value)); } catch(e) {}
      }
    })();
  }, []);

  const toggle = (setter, key, stoKey) => setter(p => { const n={...p,[key]:!p[key]}; save(stoKey,n); return n; });

  const nav = (v, city=null) => { setView(v); if(city){setSelectedCity(city);setActiveDay(0);setActiveTab("itinerary");} window.scrollTo(0,0); };

  // ── Photo handler
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoUploading(true);
    const dataUrl = await resizeImage(file);
    setPhotoInput(p => ({...p, dataUrl}));
    setPhotoUploading(false);
  };

  const addPhoto = () => {
    if (!photoInput.dataUrl || !photoInput.cityId) return;
    const city = CITIES.find(c=>c.id===photoInput.cityId);
    const newPhoto = {
      id: Date.now(),
      cityId: photoInput.cityId,
      cityName: city?.name || "",
      flag: city?.flag || "",
      color: city?.color || "#C9A84C",
      dataUrl: photoInput.dataUrl,
      review: photoInput.review,
      rating: photoInput.rating,
      date: new Date().toLocaleDateString("es-CL"),
    };
    const newPhotos = [newPhoto, ...photos];
    setPhotos(newPhotos); save("photos", newPhotos);
    setPhotoInput({ cityId:"", review:"", rating:5, dataUrl:"" });
    if (fileRef.current) fileRef.current.value = "";
  };

  const deletePhoto = (id) => {
    const np = photos.filter(p=>p.id!==id); setPhotos(np); save("photos",np);
  };

  // ── Budget
  const totalSpent = expenses.reduce((a,e)=>a+parseFloat(e.amount||0),0);
  const addExpense = () => {
    if (!expInput.city || !expInput.amount) return;
    const newExp = [...expenses, {...expInput, id:Date.now(), date:new Date().toLocaleDateString("es-CL")}];
    setExpenses(newExp); save("expenses",newExp);
    setExpInput(p=>({...p,desc:"",amount:""}));
  };

  // ── Packing
  const PACKING = [
    "Pasaporte (vigente 6+ meses desde agosto 2026)","Seguro de viaje contratado","eSIM europea comprada (Airalo/Holafly)",
    "Adaptador de corriente tipo C/F","Tarjeta sin comisión exterior (Revolut/Wise)","Copia digital pasaporte en la nube",
    "Ropa interior x7 (lavable)","Pantalones cómodos x2","Camisetas x4","Chaqueta liviana (Zúrich y noches)","Zapatos cómodos para caminar","Sandalias","Traje de baño x2",
    "Protector solar SPF 50","Antiinflamatorio (ibuprofeno)","Antidiarreico","Pastillas para el mareo","Curitas y antiséptico",
    "Botella de agua reutilizable","Mochila de día para excursiones","Candado para maleta",
    "Audífonos (museos con audioguía)","Cargador + powerbank","Tarjetas de memoria extra",
    "Mapas offline Google Maps (cada ciudad)","App Trainline o sncf-connect.com","App Flixbus","App Revolut o Wise activa",
  ];

  const ALL_SOUVENIRS = CITIES.flatMap(c=>c.souvenirs.map(s=>({city:c.name,flag:c.flag,item:s,key:c.id+"|"+s})));
  const ALL_RESERVATIONS = CITIES.flatMap(c=>c.reservations.map(r=>({city:c.name,flag:c.flag,item:r,key:c.id+"|"+r})));

  // ── Styles
  const S = {
    app:     {minHeight:"100vh",background:"#0d1117",color:"#e6edf3",fontFamily:"'Trebuchet MS','Segoe UI',sans-serif"},
    header:  {background:"#0d1117",borderBottom:"1px solid rgba(201,168,76,0.25)",position:"sticky",top:0,zIndex:200},
    hInner:  {maxWidth:"1100px",margin:"0 auto",padding:"10px 16px",display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"},
    logo:    {color:"#C9A84C",fontWeight:"900",fontSize:"18px",cursor:"pointer",flexShrink:0},
    nb:      (a)=>({background:a?"rgba(201,168,76,0.18)":"transparent",border:"1px solid "+(a?"rgba(201,168,76,0.45)":"rgba(255,255,255,0.1)"),color:a?"#C9A84C":"#8b949e",padding:"5px 12px",borderRadius:"20px",cursor:"pointer",fontSize:"12px",transition:"all .2s"}),
    main:    {maxWidth:"1100px",margin:"0 auto",padding:"20px 14px"},
    card:    {background:"#161b22",border:"1px solid #30363d",borderRadius:"12px",overflow:"hidden"},
    btn:     (col="#C9A84C",bg="rgba(201,168,76,0.15)")=>({background:bg,border:`1px solid ${col}55`,color:col,padding:"8px 16px",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:"600",transition:"all .2s"}),
    input:   {background:"#0d1117",border:"1px solid #30363d",color:"#e6edf3",padding:"8px 10px",borderRadius:"8px",fontSize:"14px",outline:"none",width:"100%"},
    chip:    (a,col)=>({padding:"6px 14px",borderRadius:"20px",fontSize:"13px",cursor:"pointer",fontWeight:"600",transition:"all .15s",border:`1px solid ${a?col:"#30363d"}`,background:a?`${col}22`:"transparent",color:a?col:"#8b949e",whiteSpace:"nowrap"}),
    badge:   (t)=>({display:"inline-block",padding:"3px 10px",borderRadius:"12px",fontSize:"11px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"1px",background:BUDGET_BADGE[t]?.bg||"rgba(255,255,255,0.1)",color:BUDGET_BADGE[t]?.color||"#8b949e"}),
    h2:      {fontSize:"20px",fontWeight:"800",color:"#C9A84C",marginBottom:"14px"},
    stars:   (n)=>"⭐".repeat(n)+"☆".repeat(5-n),
  };

  const NAV_ITEMS = [["🗺","home"],["🗓 Mi Viaje","mytrip"],["📖 Blog","blog"],["💰","budget"],["✅","checklist"],["🎒","packing"],["🛍","souvenirs"],["🛒","shopping"]];
  const Header = ({current}) => (
    <div style={S.header}>
      <div style={S.hInner}>
        <div style={S.logo} onClick={()=>nav("home")}>✈ EUROPA 2026</div>
        <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
          {NAV_ITEMS.map(([lbl,v])=>(
            <button key={v} style={S.nb(current===v)} onClick={()=>nav(v)}>{lbl}</button>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // HOME
  // ═══════════════════════════════════════════════════════════
  if (view==="home") {
    const totalVisited = Object.values(visitedSlots).filter(Boolean).length;
    const totalSlots = CITIES.reduce((a,c)=>a+c.days.reduce((b,d)=>b+d.slots.length,0),0);
    return (
      <div style={S.app}>
        <Header current="home"/>
        <div style={S.main}>
          {/* Hero */}
          <div style={{background:"linear-gradient(135deg,#161b22 0%,#0d1117 100%)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:"20px",padding:"36px 24px",textAlign:"center",marginBottom:"24px"}}>
            <div style={{fontSize:"50px",marginBottom:"12px"}}>🌍</div>
            <h1 style={{fontSize:"clamp(22px,5vw,40px)",fontWeight:"900",color:"#C9A84C",marginBottom:"6px"}}>Gran Tour Europa 2026</h1>
            <p style={{color:"#8b949e",fontSize:"15px",marginBottom:"20px"}}>10 ciudades · 6 países · 29 días 🇵🇹🇫🇷🇨🇭🇮🇹🇨🇿🇭🇺🇲🇪🇪🇸</p>
            <Countdown/>
            <div style={{display:"flex",gap:"24px",justifyContent:"center",marginTop:"20px",flexWrap:"wrap"}}>
              {[["29","Días"],["10","Ciudades"],["6","Países"],[`${totalVisited}/${totalSlots}`,"Actividades"],[ `${photos.length}`,"Fotos del Blog"]].map(([n,l])=>(
                <div key={l} style={{textAlign:"center"}}><div style={{fontSize:"26px",fontWeight:"900",color:"#C9A84C"}}>{n}</div><div style={{fontSize:"10px",color:"#8b949e",textTransform:"uppercase",letterSpacing:"2px"}}>{l}</div></div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:"10px",marginBottom:"24px"}}>
            {[
              ["🗓","Mi Viaje","Activ. visitadas","mytrip","#27ae60"],
              ["📖","Mi Blog","Fotos y reseñas","blog","#e67e22"],
              ["💰","Gastos","Registro de pagos","budget","#3498db"],
              ["✅","Reservas","Checklist","checklist","#9b59b6"],
              ["🎒","Equipaje","Qué llevar","packing","#e74c3c"],
              ["🛒","Compras","Dónde comprar barato","shopping","#1abc9c"],
            ].map(([ic,t,s,v,col])=>(
              <div key={v} onClick={()=>nav(v)} style={{background:"#161b22",border:`1px solid ${col}33`,borderRadius:"12px",padding:"16px",cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=col}
                onMouseLeave={e=>e.currentTarget.style.borderColor=`${col}33`}>
                <div style={{fontSize:"24px",marginBottom:"6px"}}>{ic}</div>
                <div style={{fontWeight:"700",color:"#e6edf3",marginBottom:"3px",fontSize:"14px"}}>{t}</div>
                <div style={{fontSize:"12px",color:"#8b949e"}}>{s}</div>
              </div>
            ))}
          </div>

          {/* City Grid */}
          <div style={S.h2}>🗺 Ciudades del Tour</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"14px"}}>
            {CITIES.map((c,i)=>{
              const citySlots = c.days.flatMap(d=>d.slots);
              const done = citySlots.filter(sl=>visitedSlots[`${c.id}|${sl.title}`]).length;
              const pct = citySlots.length > 0 ? (done/citySlots.length)*100 : 0;
              return (
                <div key={c.id} onClick={()=>nav("city",c)}
                  style={{background:"#161b22",border:`1px solid ${c.color}33`,borderRadius:"14px",overflow:"hidden",cursor:"pointer",transition:"all .25s"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor=c.color;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=`${c.color}33`;}}>
                  <div style={{borderTop:`3px solid ${c.color}`,padding:"18px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
                      <div>
                        <div style={{fontSize:"12px",color:"#8b949e",marginBottom:"3px"}}>Parada {i+1} · {c.dates}</div>
                        <div style={{fontSize:"20px",fontWeight:"900",color:"#e6edf3"}}>{c.flag} {c.name}</div>
                        <div style={{fontSize:"12px",color:"#8b949e",marginTop:"2px"}}>{c.subtitle}</div>
                      </div>
                      <div style={{fontSize:"32px",opacity:0.5}}>{c.emoji}</div>
                    </div>
                    <div style={{display:"flex",gap:"8px",alignItems:"center",flexWrap:"wrap",marginBottom:"10px"}}>
                      <span style={S.badge(c.budget)}>{BUDGET_BADGE[c.budget]?.label}</span>
                      {c.nights>0&&<span style={{fontSize:"12px",color:"#8b949e"}}>🌙 {c.nights}n</span>}
                    </div>
                    {citySlots.length>0&&(
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                          <span style={{fontSize:"11px",color:"#8b949e"}}>Actividades</span>
                          <span style={{fontSize:"11px",color:c.accent,fontWeight:"700"}}>{done}/{citySlots.length}</span>
                        </div>
                        <div style={{background:"#0d1117",borderRadius:"4px",height:"4px",overflow:"hidden"}}>
                          <div style={{background:c.color,height:"100%",width:`${pct}%`,borderRadius:"4px",transition:"width .5s"}}/>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // CITY VIEW
  // ═══════════════════════════════════════════════════════════
  if (view==="city" && selectedCity) {
    const c = selectedCity;
    const citySlots = c.days.flatMap(d=>d.slots);
    const visitedCount = citySlots.filter(sl=>visitedSlots[`${c.id}|${sl.title}`]).length;
    return (
      <div style={S.app}>
        <Header current="city"/>
        <div style={S.main}>
          {/* Hero */}
          <div style={{background:`linear-gradient(135deg,${c.color}18,#0d1117)`,border:`2px solid ${c.color}`,borderRadius:"18px",padding:"28px",marginBottom:"20px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:"16px",top:"16px",fontSize:"70px",opacity:0.12}}>{c.emoji}</div>
            <div style={{fontSize:"12px",color:"#8b949e",marginBottom:"6px"}}>{c.dates}</div>
            <h2 style={{fontSize:"32px",fontWeight:"900",color:"#e6edf3",marginBottom:"4px"}}>{c.flag} {c.name}</h2>
            <div style={{color:"#8b949e",marginBottom:"14px",fontSize:"15px"}}>{c.subtitle}</div>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center",marginBottom:"12px"}}>
              <span style={S.badge(c.budget)}>{BUDGET_BADGE[c.budget]?.label}</span>
              {c.nights>0&&<span style={{fontSize:"13px",color:"#8b949e"}}>🌙 {c.nights} noches</span>}
              <span style={{fontSize:"13px",color:c.accent,fontWeight:"700"}}>✅ {visitedCount}/{citySlots.length} actividades</span>
            </div>
            <div style={{background:"rgba(0,0,0,0.3)",borderRadius:"8px",padding:"10px 14px",fontSize:"13px",color:"#8b949e"}}>
              <strong style={{color:"#C9A84C"}}>🚌 Transporte:</strong> {c.transport}
            </div>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:"6px",marginBottom:"20px",overflowX:"auto",paddingBottom:"4px"}}>
            {[["🗓 Itinerario","itinerary"],["📍 Mi Visita","visit"],["🍽 Gastronomía","food"],["💡 Tips","tips"],["🛒 Compras","shopping"],["🛍 Souvenirs","souvenirs"],["✅ Reservas","reservations"]].map(([lbl,tab])=>(
              <button key={tab} style={S.chip(activeTab===tab,c.color)} onClick={()=>setActiveTab(tab)}>{lbl}</button>
            ))}
          </div>

          {/* ── ITINERARY */}
          {activeTab==="itinerary"&&(
            <div>
              {c.days.length>1&&(
                <div style={{display:"flex",gap:"6px",marginBottom:"16px",overflowX:"auto",paddingBottom:"4px"}}>
                  {c.days.map((d,i)=><button key={i} style={S.chip(activeDay===i,c.accent)} onClick={()=>setActiveDay(i)}>Día {i+1}</button>)}
                </div>
              )}
              <div style={{...S.card,padding:"22px"}}>
                <h3 style={{color:c.accent,marginBottom:"18px",fontSize:"17px",fontWeight:"800"}}>{c.days[activeDay]?.day}</h3>
                {c.days[activeDay]?.slots.map((slot,i)=>(
                  <div key={i} style={{display:"flex",gap:"14px",marginBottom:"18px"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                      <div style={{width:"38px",height:"38px",borderRadius:"50%",background:`${c.color}18`,border:`2px solid ${c.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",flexShrink:0}}>{slot.icon}</div>
                      {i<c.days[activeDay].slots.length-1&&<div style={{width:"2px",flex:1,background:`${c.color}28`,marginTop:"4px",minHeight:"18px"}}/>}
                    </div>
                    <div style={{paddingTop:"6px",flex:1}}>
                      <div style={{fontSize:"11px",color:c.accent,fontWeight:"700",marginBottom:"2px"}}>{slot.time}</div>
                      <div style={{fontWeight:"700",color:"#e6edf3",marginBottom:"3px",fontSize:"14px"}}>{slot.title}</div>
                      <div style={{fontSize:"13px",color:"#8b949e",lineHeight:"1.6"}}>{slot.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MI VISITA (checklist de actividades) */}
          {activeTab==="visit"&&(
            <div>
              <div style={{...S.card,padding:"22px",marginBottom:"16px"}}>
                <h3 style={{color:"#27ae60",marginBottom:"6px",fontSize:"16px",fontWeight:"800"}}>📍 ¿Qué hice en {c.name}?</h3>
                <p style={{fontSize:"13px",color:"#8b949e",marginBottom:"18px"}}>Marca cada actividad que completaste. Se guarda automáticamente.</p>
                <div style={{background:"#0d1117",borderRadius:"8px",height:"6px",marginBottom:"16px",overflow:"hidden"}}>
                  <div style={{background:"#27ae60",height:"100%",width:`${citySlots.length>0?(visitedCount/citySlots.length)*100:0}%`,borderRadius:"8px",transition:"width .4s"}}/>
                </div>
                {c.days.map((day,di)=>(
                  <div key={di} style={{marginBottom:"20px"}}>
                    <div style={{fontSize:"13px",color:c.accent,fontWeight:"700",marginBottom:"10px",paddingBottom:"6px",borderBottom:`1px solid ${c.color}28`}}>{day.day}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                      {day.slots.map((slot,si)=>{
                        const key=`${c.id}|${slot.title}`;
                        const chk=visitedSlots[key];
                        return (
                          <div key={si} onClick={()=>toggle(setVisitedSlots,key,"visitedSlots")}
                            style={{display:"flex",gap:"12px",alignItems:"flex-start",background:chk?"rgba(39,174,96,0.08)":"#161b22",borderRadius:"10px",padding:"12px",border:`1px solid ${chk?"rgba(39,174,96,0.4)":"#30363d"}`,cursor:"pointer",transition:"all .2s"}}>
                            <div style={{width:"22px",height:"22px",borderRadius:"6px",border:`2px solid ${chk?"#27ae60":"#30363d"}`,background:chk?"#27ae60":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"13px",marginTop:"1px",color:"#fff"}}>{chk?"✓":""}</div>
                            <div style={{flex:1}}>
                              <div style={{fontSize:"13px",fontWeight:"700",color:chk?"#27ae60":"#e6edf3",textDecoration:chk?"line-through":"none",marginBottom:"2px"}}>{slot.icon} {slot.title}</div>
                              <div style={{fontSize:"12px",color:"#8b949e"}}>{slot.time}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {/* Quick blog from city */}
              <div style={{...S.card,padding:"22px"}}>
                <h3 style={{color:"#e67e22",marginBottom:"14px",fontSize:"16px",fontWeight:"800"}}>📸 Agregar foto de {c.name} al Blog</h3>
                <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} style={{display:"none"}}/>
                  <button style={S.btn("#e67e22","rgba(230,126,34,0.12)")} onClick={()=>fileRef.current?.click()}>
                    {photoUploading?"⏳ Procesando...":"📷 Seleccionar foto"}
                  </button>
                  {photoInput.dataUrl&&(
                    <img src={photoInput.dataUrl} alt="preview" style={{borderRadius:"10px",maxHeight:"200px",objectFit:"cover",width:"100%"}}/>
                  )}
                  <textarea style={{...S.input,minHeight:"80px",resize:"vertical"}} placeholder="Escribe tu reseña: ¿Qué sentiste? ¿Qué fue lo más impresionante?" value={photoInput.review} onChange={e=>setPhotoInput(p=>({...p,review:e.target.value}))}/>
                  <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                    <span style={{fontSize:"13px",color:"#8b949e"}}>Rating:</span>
                    {[1,2,3,4,5].map(n=>(
                      <button key={n} onClick={()=>setPhotoInput(p=>({...p,rating:n}))} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:"20px",opacity:n<=photoInput.rating?1:0.3,padding:"2px"}}>{n<=photoInput.rating?"⭐":"☆"}</button>
                    ))}
                  </div>
                  <button style={S.btn("#e67e22","rgba(230,126,34,0.15)")} onClick={()=>{setPhotoInput(p=>({...p,cityId:c.id}));setTimeout(addPhoto,50);}}>
                    ✅ Guardar en mi Blog
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── FOOD */}
          {activeTab==="food"&&(
            <div style={{...S.card,padding:"22px"}}>
              <h3 style={{color:c.accent,marginBottom:"18px"}}>🍽 No te puedes ir sin probar...</h3>
              <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
                {c.gastronomy.map((g,i)=>(
                  <span key={i} style={{background:`${c.color}18`,border:`1px solid ${c.color}44`,color:"#e6edf3",padding:"10px 16px",borderRadius:"24px",fontSize:"14px",fontWeight:"500"}}>{g}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── TIPS */}
          {activeTab==="tips"&&(
            <div style={{...S.card,padding:"22px"}}>
              <h3 style={{color:"#27ae60",marginBottom:"18px"}}>💰 Trucos para ahorrar en {c.name}</h3>
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {c.savings.map((tip,i)=>(
                  <div key={i} style={{display:"flex",gap:"10px",background:"#0d1117",borderRadius:"10px",padding:"14px",border:"1px solid rgba(39,174,96,0.18)"}}>
                    <span style={{fontSize:"18px",flexShrink:0}}>💡</span>
                    <span style={{fontSize:"13px",color:"#8b949e",lineHeight:"1.6"}}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SHOPPING */}
          {activeTab==="shopping"&&(
            <div style={{...S.card,padding:"22px"}}>
              <h3 style={{color:"#1abc9c",marginBottom:"18px"}}>🛒 Dónde comprar barato en {c.name}</h3>
              {c.shopping.length===0&&<p style={{color:"#8b949e",fontSize:"14px"}}>Sin tips específicos de compras para esta ciudad.</p>}
              <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                {c.shopping.map((s,i)=>(
                  <div key={i} style={{background:"#0d1117",borderRadius:"10px",padding:"16px",border:"1px solid rgba(26,188,156,0.2)"}}>
                    <div style={{fontWeight:"700",color:"#1abc9c",marginBottom:"8px",fontSize:"14px"}}>{s.cat}</div>
                    <div style={{fontSize:"13px",color:"#8b949e",lineHeight:"1.6"}}>{s.tip}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SOUVENIRS */}
          {activeTab==="souvenirs"&&(
            <div style={{...S.card,padding:"22px"}}>
              <h3 style={{color:"#9b59b6",marginBottom:"18px"}}>🛍 Souvenirs de {c.name}</h3>
              {c.souvenirs.length===0&&<p style={{color:"#8b949e"}}>Sin souvenirs específicos para esta parada.</p>}
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                {c.souvenirs.map((s,i)=>{
                  const key=c.id+"|"+s; const chk=souvenirChecked[key];
                  return (
                    <div key={i} onClick={()=>toggle(setSouvenirChecked,key,"souvenirChecked")}
                      style={{display:"flex",gap:"12px",alignItems:"flex-start",background:"#0d1117",borderRadius:"10px",padding:"12px",border:`1px solid ${chk?"rgba(155,89,182,0.4)":"#30363d"}`,cursor:"pointer",transition:"all .2s",opacity:chk?.6:1}}>
                      <div style={{width:"20px",height:"20px",borderRadius:"5px",border:`2px solid ${chk?"#9b59b6":"#30363d"}`,background:chk?"#9b59b6":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"12px",color:"#fff"}}>{chk?"✓":""}</div>
                      <span style={{fontSize:"13px",color:chk?"#8b949e":"#e6edf3",textDecoration:chk?"line-through":"none",lineHeight:"1.5"}}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── RESERVATIONS */}
          {activeTab==="reservations"&&(
            <div style={{...S.card,padding:"22px"}}>
              <h3 style={{color:"#3498db",marginBottom:"18px"}}>✅ Cosas por reservar en {c.name}</h3>
              <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                {c.reservations.map((r,i)=>{
                  const key=c.id+"|"+r; const chk=reservChecked[key];
                  return (
                    <div key={i} onClick={()=>toggle(setReservChecked,key,"reservChecked")}
                      style={{display:"flex",gap:"12px",alignItems:"center",background:"#0d1117",borderRadius:"8px",padding:"12px",border:`1px solid ${chk?"rgba(52,152,219,0.4)":"#30363d"}`,cursor:"pointer",transition:"all .2s",opacity:chk?.6:1}}>
                      <div style={{width:"20px",height:"20px",borderRadius:"5px",border:`2px solid ${chk?"#3498db":"#30363d"}`,background:chk?"#3498db":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"12px",color:"#fff"}}>{chk?"✓":""}</div>
                      <span style={{fontSize:"13px",color:chk?"#8b949e":"#e6edf3",textDecoration:chk?"line-through":"none"}}>{r}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{display:"flex",justifyContent:"space-between",gap:"10px",marginTop:"20px",flexWrap:"wrap"}}>
            {CITIES.findIndex(x=>x.id===c.id)>0&&(
              <button style={S.btn("#8b949e","rgba(139,148,158,0.1)")} onClick={()=>{const i=CITIES.findIndex(x=>x.id===c.id);nav("city",CITIES[i-1]);}}>← Anterior</button>
            )}
            <button style={S.btn()} onClick={()=>nav("home")}>🗺 Todas las ciudades</button>
            {CITIES.findIndex(x=>x.id===c.id)<CITIES.length-1&&(
              <button style={S.btn(c.color,`${c.color}18`)} onClick={()=>{const i=CITIES.findIndex(x=>x.id===c.id);nav("city",CITIES[i+1]);}}>Siguiente →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MY TRIP — actividades visitadas global
  // ═══════════════════════════════════════════════════════════
  if (view==="mytrip") {
    const totalSlots = CITIES.reduce((a,c)=>a+c.days.reduce((b,d)=>b+d.slots.length,0),0);
    const totalVisited = Object.values(visitedSlots).filter(Boolean).length;
    return (
      <div style={S.app}>
        <Header current="mytrip"/>
        <div style={S.main}>
          <div style={{...S.card,padding:"24px",marginBottom:"20px",textAlign:"center"}}>
            <div style={{fontSize:"48px",fontWeight:"900",color:"#27ae60"}}>{totalVisited}<span style={{color:"#8b949e",fontSize:"28px"}}>/{totalSlots}</span></div>
            <div style={{color:"#8b949e",marginBottom:"14px"}}>actividades completadas</div>
            <div style={{background:"#0d1117",borderRadius:"8px",height:"10px",overflow:"hidden"}}>
              <div style={{background:"#27ae60",height:"100%",width:`${(totalVisited/totalSlots)*100}%`,borderRadius:"8px",transition:"width .5s"}}/>
            </div>
          </div>
          {CITIES.map(c=>{
            const citySlots = c.days.flatMap(d=>d.slots);
            const done = citySlots.filter(sl=>visitedSlots[`${c.id}|${sl.title}`]).length;
            return (
              <div key={c.id} style={{...S.card,marginBottom:"14px",padding:"18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <span style={{fontSize:"20px"}}>{c.flag}</span>
                    <span style={{fontWeight:"700",fontSize:"15px"}}>{c.name}</span>
                    <span style={{fontSize:"12px",color:"#8b949e"}}>{c.dates}</span>
                  </div>
                  <span style={{fontSize:"13px",color:done===citySlots.length&&citySlots.length>0?"#27ae60":c.accent,fontWeight:"700"}}>{done}/{citySlots.length}</span>
                </div>
                <div style={{background:"#0d1117",borderRadius:"4px",height:"5px",marginBottom:"12px",overflow:"hidden"}}>
                  <div style={{background:c.color,height:"100%",width:`${citySlots.length>0?(done/citySlots.length)*100:0}%`,borderRadius:"4px",transition:"width .5s"}}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                  {citySlots.map((slot,i)=>{
                    const key=`${c.id}|${slot.title}`; const chk=visitedSlots[key];
                    return (
                      <div key={i} onClick={()=>toggle(setVisitedSlots,key,"visitedSlots")}
                        style={{display:"flex",gap:"10px",alignItems:"center",padding:"9px 12px",borderRadius:"8px",background:chk?"rgba(39,174,96,0.08)":"#0d1117",border:`1px solid ${chk?"rgba(39,174,96,0.3)":"#30363d"}`,cursor:"pointer",transition:"all .15s"}}>
                        <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${chk?"#27ae60":"#30363d"}`,background:chk?"#27ae60":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"11px",color:"#fff"}}>{chk?"✓":""}</div>
                        <span style={{fontSize:"13px"}}>{slot.icon}</span>
                        <span style={{fontSize:"13px",color:chk?"#27ae60":"#8b949e",textDecoration:chk?"line-through":"none",flex:1}}>{slot.title}</span>
                        <span style={{fontSize:"11px",color:"#8b949e"}}>{slot.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // BLOG — fotos + reseñas
  // ═══════════════════════════════════════════════════════════
  if (view==="blog") {
    return (
      <div style={S.app}>
        <Header current="blog"/>
        <div style={S.main}>
          {/* Add photo */}
          <div style={{...S.card,padding:"22px",marginBottom:"24px"}}>
            <div style={S.h2}>📸 Agregar al Blog de Viaje</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
              <select style={S.input} value={photoInput.cityId} onChange={e=>setPhotoInput(p=>({...p,cityId:e.target.value}))}>
                <option value="">Ciudad...</option>
                {CITIES.map(c=><option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
              </select>
              <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
                <span style={{fontSize:"12px",color:"#8b949e",flexShrink:0}}>Rating:</span>
                {[1,2,3,4,5].map(n=>(
                  <button key={n} onClick={()=>setPhotoInput(p=>({...p,rating:n}))} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:"18px",opacity:n<=photoInput.rating?1:0.25,padding:"2px"}}>⭐</button>
                ))}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} style={{display:"none"}}/>
            <button style={{...S.btn("#e67e22","rgba(230,126,34,0.12)"),width:"100%",marginBottom:"10px"}} onClick={()=>fileRef.current?.click()}>
              {photoUploading?"⏳ Procesando imagen...":"📷 Seleccionar foto del lugar"}
            </button>
            {photoInput.dataUrl&&(
              <img src={photoInput.dataUrl} alt="preview" style={{borderRadius:"10px",maxHeight:"240px",objectFit:"cover",width:"100%",marginBottom:"10px"}}/>
            )}
            <textarea style={{...S.input,minHeight:"90px",resize:"vertical",marginBottom:"10px"}} placeholder="Tu reseña: ¿Qué sentiste? ¿Cuál fue el momento más especial? ¿Lo recomendarías? Cuéntalo todo..." value={photoInput.review} onChange={e=>setPhotoInput(p=>({...p,review:e.target.value}))}/>
            <button style={{...S.btn("#e67e22","rgba(230,126,34,0.18)"),width:"100%"}} onClick={addPhoto}>
              ✅ Publicar en mi Blog
            </button>
          </div>

          {/* Blog entries */}
          {photos.length===0&&(
            <div style={{textAlign:"center",padding:"50px 20px",color:"#8b949e"}}>
              <div style={{fontSize:"50px",marginBottom:"12px"}}>📷</div>
              <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"8px"}}>Tu blog está vacío</div>
              <div style={{fontSize:"14px"}}>Sube tu primera foto y reseña del viaje</div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"16px"}}>
            {photos.map(p=>(
              <div key={p.id} style={{background:"#161b22",border:`1px solid ${p.color}33`,borderRadius:"14px",overflow:"hidden"}}>
                {p.dataUrl&&<img src={p.dataUrl} alt={p.cityName} style={{width:"100%",height:"200px",objectFit:"cover"}}/>}
                <div style={{padding:"16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"8px"}}>
                    <div>
                      <span style={{fontSize:"16px"}}>{p.flag}</span>
                      <span style={{fontWeight:"700",marginLeft:"6px",color:"#e6edf3"}}>{p.cityName}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <span style={{fontSize:"13px",color:"#C9A84C"}}>{"⭐".repeat(p.rating)}</span>
                      <button onClick={()=>deletePhoto(p.id)} style={{background:"transparent",border:"1px solid rgba(231,76,60,0.3)",color:"#e74c3c",padding:"2px 8px",borderRadius:"6px",cursor:"pointer",fontSize:"12px"}}>×</button>
                    </div>
                  </div>
                  <div style={{fontSize:"12px",color:"#8b949e",marginBottom:"8px"}}>{p.date}</div>
                  {p.review&&<div style={{fontSize:"13px",color:"#c9d1d9",lineHeight:"1.6",fontStyle:"italic"}}>"{p.review}"</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // SHOPPING — guía de compras baratas por ciudad
  // ═══════════════════════════════════════════════════════════
  if (view==="shopping") {
    const GLOBAL_TIPS = [
      { icon:"🥇", title:"Praga — El paraíso del shopping económico", tip:"La ciudad MÁS BARATA del viaje para compras. Granates checos auténticos (aretes desde €15), cristal de Bohemia (copas desde €8), marionetas artesanales (desde €15). Precios un 40–60% más bajos que Europa occidental.", cities:"🇨🇿" },
      { icon:"🥈", title:"Budapest — Segunda más barata", tip:"Paprika decorativa desde €3, bordados de Kalocsa desde €5, porcelana Herend desde €15. El mercado Ecseri (sábados) para ropa vintage y joyas de plata desde €1. Buda es para la historia; el mercado es para las compras.", cities:"🇭🇺" },
      { icon:"🥉", title:"Montenegro — Artesanía al precio más bajo", tip:"Joyería de filigrana de plata única de los Balcanes desde €12. Ropa de playa desde €3. Vino Vranac desde €5. Precios del tercer mundo con calidad mediterránea.", cities:"🇲🇪" },
      { icon:"💍", title:"¿Dónde comprar joyas de calidad?", tip:"ORDEN DE PRECIO: 1) Montenegro (filigrana plata €12+) → 2) Praga (granates checos €15+, ámbar €5) → 3) Budapest (bordados, porcelana) → 4) Venecia (vidrio Murano €8+) → 5) Lisboa (plata portuguesa €20+). Evita Zúrich y París para joyas.", cities:"💍" },
      { icon:"👗", title:"¿Dónde comprar ropa más barata?", tip:"ORDEN DE PRECIO: 1) Budapest (Ecseri market, H&M local) → 2) Praga (Palladium, mercado Havelský) → 3) Madrid (El Rastro, Zara origen) → 4) Lisboa (cuero artesanal, Feira da Ladra) → 5) París (Marché aux Puces vintage). Evita Zúrich para ropa.", cities:"👗" },
      { icon:"🧴", title:"¿Dónde comprar belleza y cosmética?", tip:"París gana: farmacias con L'Occitane, Bioderma, La Roche-Posay, Avène 30–50% más baratos que en Chile. Llevar una lista antes de llegar. Madrid también tiene Mercadona con cosméticos propios excelentes desde €2.", cities:"💄" },
    ];
    return (
      <div style={S.app}>
        <Header current="shopping"/>
        <div style={S.main}>
          <div style={S.h2}>🛒 Guía de Compras Baratas en Europa</div>
          {/* Global ranking */}
          <div style={{...S.card,padding:"22px",marginBottom:"24px"}}>
            <h3 style={{color:"#1abc9c",marginBottom:"16px",fontSize:"16px",fontWeight:"800"}}>🌍 Guía Global de Dónde Comprar</h3>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              {GLOBAL_TIPS.map((t,i)=>(
                <div key={i} style={{background:"#0d1117",borderRadius:"10px",padding:"16px",border:"1px solid rgba(26,188,156,0.18)"}}>
                  <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                    <span style={{fontSize:"22px",flexShrink:0}}>{t.icon}</span>
                    <div>
                      <div style={{fontWeight:"700",color:"#1abc9c",marginBottom:"6px",fontSize:"14px"}}>{t.title} <span style={{marginLeft:"6px"}}>{t.cities}</span></div>
                      <div style={{fontSize:"13px",color:"#8b949e",lineHeight:"1.6"}}>{t.tip}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By city */}
          {CITIES.filter(c=>c.shopping.length>0).map(c=>(
            <div key={c.id} style={{...S.card,marginBottom:"14px",padding:"20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
                <span style={{fontSize:"22px"}}>{c.flag}</span>
                <div>
                  <div style={{fontWeight:"800",fontSize:"16px",color:"#e6edf3"}}>{c.name}</div>
                  <div style={{fontSize:"12px",color:"#8b949e"}}>{c.dates} · <span style={S.badge(c.budget)}>{BUDGET_BADGE[c.budget]?.label}</span></div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                {c.shopping.map((s,i)=>(
                  <div key={i} style={{background:"#0d1117",borderRadius:"10px",padding:"14px",border:"1px solid rgba(26,188,156,0.15)"}}>
                    <div style={{fontWeight:"700",color:"#1abc9c",marginBottom:"6px",fontSize:"14px"}}>{s.cat}</div>
                    <div style={{fontSize:"13px",color:"#8b949e",lineHeight:"1.6"}}>{s.tip}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // BUDGET
  // ═══════════════════════════════════════════════════════════
  if (view==="budget") {
    const CATS = ["Comida","Transporte","Entrada/Museo","Hotel","Souvenir","Compra Personal","Otro"];
    const byCity = CITIES.reduce((acc,c)=>{ acc[c.name]=expenses.filter(e=>e.city===c.name).reduce((s,e)=>s+parseFloat(e.amount||0),0); return acc; },{});
    return (
      <div style={S.app}>
        <Header current="budget"/>
        <div style={S.main}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"12px",marginBottom:"20px"}}>
            {[["€"+totalSpent.toFixed(0),"Total Gastado","rgba(201,168,76,0.3)","#C9A84C"],[expenses.length,"Registros","rgba(39,174,96,0.3)","#27ae60"],["€"+(expenses.length?totalSpent/expenses.length:0).toFixed(0),"Promedio","rgba(52,152,219,0.3)","#3498db"]].map(([n,l,bg,col])=>(
              <div key={l} style={{background:"#161b22",border:`1px solid ${bg}`,borderRadius:"12px",padding:"18px",textAlign:"center"}}>
                <div style={{fontSize:"28px",fontWeight:"900",color:col}}>{n}</div>
                <div style={{fontSize:"11px",color:"#8b949e",textTransform:"uppercase",letterSpacing:"1px",marginTop:"3px"}}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{...S.card,padding:"20px",marginBottom:"20px"}}>
            <div style={S.h2}>+ Registrar Gasto</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:"10px"}}>
              <select style={S.input} value={expInput.city} onChange={e=>setExpInput(p=>({...p,city:e.target.value}))}>
                <option value="">Ciudad...</option>
                {CITIES.map(c=><option key={c.id} value={c.name}>{c.flag} {c.name}</option>)}
              </select>
              <select style={S.input} value={expInput.cat} onChange={e=>setExpInput(p=>({...p,cat:e.target.value}))}>
                {CATS.map(cat=><option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input style={S.input} placeholder="Descripción (opcional)" value={expInput.desc} onChange={e=>setExpInput(p=>({...p,desc:e.target.value}))}/>
              <div style={{display:"flex",gap:"8px"}}>
                <input style={{...S.input,flex:1}} type="number" placeholder="Monto €" value={expInput.amount} onChange={e=>setExpInput(p=>({...p,amount:e.target.value}))}/>
                <button style={S.btn()} onClick={addExpense}>+</button>
              </div>
            </div>
          </div>

          <div style={{...S.card,padding:"20px",marginBottom:"20px"}}>
            <div style={S.h2}>📊 Por Ciudad</div>
            {CITIES.filter(c=>c.nights>0||c.id==="madrid-transit").map(c=>{
              const spent=byCity[c.name]||0; const est=c.budgetDay*Math.max(c.nights,1);
              const pct=est>0?Math.min(100,(spent/est)*100):0;
              return (
                <div key={c.id} style={{background:"#0d1117",borderRadius:"10px",padding:"12px",marginBottom:"8px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                    <span style={{fontWeight:"600",fontSize:"14px"}}>{c.flag} {c.name}</span>
                    <span style={{color:spent>est?"#e74c3c":"#27ae60",fontWeight:"700",fontSize:"13px"}}>€{spent.toFixed(0)} / ~€{est}</span>
                  </div>
                  <div style={{background:"#161b22",borderRadius:"4px",height:"5px",overflow:"hidden"}}>
                    <div style={{background:spent>est?"#e74c3c":c.color,height:"100%",width:`${pct}%`,borderRadius:"4px",transition:"width .5s"}}/>
                  </div>
                </div>
              );
            })}
          </div>

          {expenses.length>0&&(
            <div style={{...S.card,padding:"20px"}}>
              <div style={S.h2}>📋 Historial</div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                {[...expenses].reverse().map(e=>(
                  <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#0d1117",borderRadius:"8px",padding:"10px 14px"}}>
                    <div>
                      <span style={{fontSize:"12px",color:"#8b949e"}}>{e.date} · {CITIES.find(c=>c.name===e.city)?.flag} {e.city} · </span>
                      <span style={{fontSize:"12px",color:"#C9A84C"}}>{e.cat}</span>
                      {e.desc&&<span style={{fontSize:"12px",color:"#8b949e"}}> — {e.desc}</span>}
                    </div>
                    <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                      <span style={{fontWeight:"700",fontSize:"14px"}}>€{parseFloat(e.amount).toFixed(2)}</span>
                      <button onClick={()=>{const n=expenses.filter(x=>x.id!==e.id);setExpenses(n);save("expenses",n);}} style={{background:"transparent",border:"1px solid rgba(231,76,60,0.3)",color:"#e74c3c",padding:"2px 6px",borderRadius:"5px",cursor:"pointer",fontSize:"11px"}}>×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // CHECKLIST
  // ═══════════════════════════════════════════════════════════
  if (view==="checklist") {
    const total=ALL_RESERVATIONS.length; const done=ALL_RESERVATIONS.filter(r=>reservChecked[r.key]).length;
    return (
      <div style={S.app}>
        <Header current="checklist"/>
        <div style={S.main}>
          <div style={{...S.card,padding:"22px",marginBottom:"20px",textAlign:"center"}}>
            <div style={{fontSize:"46px",fontWeight:"900",color:"#3498db"}}>{done}<span style={{color:"#8b949e",fontSize:"26px"}}>/{total}</span></div>
            <div style={{color:"#8b949e",marginBottom:"14px"}}>reservas completadas</div>
            <div style={{background:"#0d1117",borderRadius:"8px",height:"8px",overflow:"hidden"}}>
              <div style={{background:"#3498db",height:"100%",width:`${(done/total)*100}%`,borderRadius:"8px",transition:"width .5s"}}/>
            </div>
          </div>
          {CITIES.map(c=>(
            <div key={c.id} style={{...S.card,marginBottom:"12px",padding:"18px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
                <span style={{fontSize:"18px"}}>{c.flag}</span>
                <span style={{fontWeight:"700",fontSize:"15px"}}>{c.name}</span>
                <span style={{fontSize:"11px",color:"#8b949e"}}>{c.dates}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                {c.reservations.map(r=>{
                  const key=c.id+"|"+r; const chk=reservChecked[key];
                  return (
                    <div key={key} onClick={()=>toggle(setReservChecked,key,"reservChecked")}
                      style={{display:"flex",gap:"10px",alignItems:"center",background:"#0d1117",borderRadius:"8px",padding:"10px",border:`1px solid ${chk?"rgba(52,152,219,0.4)":"#30363d"}`,cursor:"pointer",transition:"all .15s",opacity:chk?.6:1}}>
                      <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${chk?"#3498db":"#30363d"}`,background:chk?"#3498db":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"11px",color:"#fff"}}>{chk?"✓":""}</div>
                      <span style={{fontSize:"13px",color:chk?"#8b949e":"#e6edf3",textDecoration:chk?"line-through":"none"}}>{r}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // PACKING
  // ═══════════════════════════════════════════════════════════
  if (view==="packing") {
    const done=PACKING.filter(p=>packChecked[p]).length;
    const groups=[
      ["📄 Documentos y Finanzas",PACKING.slice(0,6)],["👕 Ropa",PACKING.slice(6,13)],
      ["💊 Salud",PACKING.slice(13,18)],["🎒 Accesorios",PACKING.slice(18,21)],["📱 Tecnología",PACKING.slice(21)],
    ];
    return (
      <div style={S.app}>
        <Header current="packing"/>
        <div style={S.main}>
          <div style={{...S.card,padding:"22px",marginBottom:"20px",textAlign:"center"}}>
            <div style={{fontSize:"46px",fontWeight:"900",color:"#e67e22"}}>{done}<span style={{color:"#8b949e",fontSize:"26px"}}>/{PACKING.length}</span></div>
            <div style={{color:"#8b949e",marginBottom:"14px"}}>ítems empacados</div>
            <div style={{background:"#0d1117",borderRadius:"8px",height:"8px",overflow:"hidden"}}>
              <div style={{background:"#e67e22",height:"100%",width:`${(done/PACKING.length)*100}%`,borderRadius:"8px",transition:"width .5s"}}/>
            </div>
          </div>
          {groups.map(([title,items])=>(
            <div key={title} style={{...S.card,marginBottom:"12px",padding:"18px"}}>
              <div style={{fontWeight:"700",color:"#e67e22",marginBottom:"12px",fontSize:"14px"}}>{title}</div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                {items.map(item=>{
                  const chk=packChecked[item];
                  return (
                    <div key={item} onClick={()=>toggle(setPackChecked,item,"packChecked")}
                      style={{display:"flex",gap:"10px",alignItems:"center",background:"#0d1117",borderRadius:"8px",padding:"10px",border:`1px solid ${chk?"rgba(230,126,34,0.4)":"#30363d"}`,cursor:"pointer",transition:"all .15s",opacity:chk?.55:1}}>
                      <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${chk?"#e67e22":"#30363d"}`,background:chk?"#e67e22":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"11px",color:"#fff"}}>{chk?"✓":""}</div>
                      <span style={{fontSize:"13px",color:chk?"#8b949e":"#e6edf3",textDecoration:chk?"line-through":"none"}}>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // SOUVENIRS
  // ═══════════════════════════════════════════════════════════
  if (view==="souvenirs") {
    const done=ALL_SOUVENIRS.filter(s=>souvenirChecked[s.key]).length;
    return (
      <div style={S.app}>
        <Header current="souvenirs"/>
        <div style={S.main}>
          <div style={{...S.card,padding:"22px",marginBottom:"20px",textAlign:"center"}}>
            <div style={{fontSize:"46px",fontWeight:"900",color:"#9b59b6"}}>{done}<span style={{color:"#8b949e",fontSize:"26px"}}>/{ALL_SOUVENIRS.length}</span></div>
            <div style={{color:"#8b949e",marginBottom:"14px"}}>souvenirs conseguidos</div>
            <div style={{background:"#0d1117",borderRadius:"8px",height:"8px",overflow:"hidden"}}>
              <div style={{background:"#9b59b6",height:"100%",width:`${(done/ALL_SOUVENIRS.length)*100}%`,borderRadius:"8px",transition:"width .5s"}}/>
            </div>
          </div>
          {CITIES.filter(c=>c.souvenirs.length>0).map(c=>(
            <div key={c.id} style={{...S.card,marginBottom:"12px",padding:"18px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"12px"}}>
                <span style={{fontSize:"20px"}}>{c.flag}</span>
                <span style={{fontWeight:"700",fontSize:"15px"}}>{c.name}</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                {c.souvenirs.map(s=>{
                  const key=c.id+"|"+s; const chk=souvenirChecked[key];
                  return (
                    <div key={key} onClick={()=>toggle(setSouvenirChecked,key,"souvenirChecked")}
                      style={{display:"flex",gap:"10px",alignItems:"flex-start",background:"#0d1117",borderRadius:"8px",padding:"10px",border:`1px solid ${chk?"rgba(155,89,182,0.4)":"#30363d"}`,cursor:"pointer",transition:"all .15s",opacity:chk?.55:1}}>
                      <div style={{width:"18px",height:"18px",borderRadius:"4px",border:`2px solid ${chk?"#9b59b6":"#30363d"}`,background:chk?"#9b59b6":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"11px",marginTop:"1px",color:"#fff"}}>{chk?"✓":""}</div>
                      <span style={{fontSize:"13px",color:chk?"#8b949e":"#e6edf3",textDecoration:chk?"line-through":"none",lineHeight:"1.5"}}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
