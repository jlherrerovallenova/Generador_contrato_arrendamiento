import React from 'react';
import { 
  ContractData, 
  PartyType, 
  PetOption, 
  FurnitureOption, 
  PaymentMethod, 
  RentUpdateOption,
  ExpensePayer
} from '../types';

interface ContractPreviewProps {
  data: ContractData;
}

export const ContractPreview: React.FC<ContractPreviewProps> = ({ data }) => {
  const landlords = data.parties.filter(p => p.type === PartyType.LANDLORD);
  const tenants = data.parties.filter(p => p.type === PartyType.TENANT);
  const guarantors = data.parties.filter(p => p.type === PartyType.GUARANTOR);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '_______________';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const money = (amount: number | undefined) => (amount || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="contract-document bg-white p-12 max-w-[21cm] mx-auto shadow-lg text-justify font-serif text-[10pt] leading-normal text-black">
      
      <div className="text-center mb-10">
        <h1 className="font-bold uppercase text-[16pt] mb-2">CONTRATO DE ARRENDAMIENTO DE VIVIENDA</h1>
      </div>

      <p className="mb-6">
        En <strong>{data.property.location || '__________'}</strong>, a <strong>{formatDate(data.property.date)}</strong>.
      </p>

      <div className="mb-8">
        <h2 className="font-bold uppercase border-b-2 border-black mb-4 pb-1">REUNIDOS</h2>

        <div className="pl-4 mb-4">
          <p className="font-bold mb-2 underline">DE UNA PARTE (La "Parte Arrendadora"):</p>
          {landlords.map((p, i) => (
            <p key={i} className="mb-2">
              D./Dña. <strong>{p.fullName}</strong>, mayor de edad, con DNI/NIE <strong>{p.docNumber}</strong>, 
              y domicilio a efectos de notificaciones en <strong>{p.address}</strong>.
            </p>
          ))}
        </div>

        <div className="pl-4 mb-4">
          <p className="font-bold mb-2 underline">DE OTRA PARTE (La "Parte Arrendataria"):</p>
          {tenants.map((p, i) => (
            <p key={i} className="mb-2">
              D./Dña. <strong>{p.fullName}</strong>, mayor de edad, con DNI/NIE <strong>{p.docNumber}</strong>, 
              y domicilio a efectos de notificaciones en la vivienda objeto de arrendamiento.
            </p>
          ))}
        </div>

        {guarantors.length > 0 && (
          <div className="pl-4 mb-4">
            <p className="font-bold mb-2 underline">Y DE OTRA PARTE (La "Parte Avalista"):</p>
            {guarantors.map((p, i) => (
              <p key={i} className="mb-2">
                D./Dña. <strong>{p.fullName}</strong>, mayor de edad, con DNI/NIE <strong>{p.docNumber}</strong>, 
                y domicilio en <strong>{p.address}</strong>.
              </p>
            ))}
          </div>
        )}
      </div>

      <p className="mb-6">
        Las partes se reconocen mutua y recíprocamente la capacidad legal necesaria para otorgar el presente 
        <strong> CONTRATO DE ARRENDAMIENTO DE VIVIENDA</strong>, y a tal efecto,
      </p>

      <div className="mb-8">
        <h2 className="font-bold uppercase border-b-2 border-black mb-4 pb-1">EXPONEN</h2>
        
        <ol className="list-[upper-roman] list-inside space-y-3">
          <li>
            Que la Parte Arrendadora es propietaria en pleno dominio de la vivienda sita en:
            <br/>
            <strong>{data.property.address}</strong>.
            <br/>
            Referencia Catastral: <strong>{data.property.catastralRef}</strong>.
            <br/>
            La vivienda cuenta con Cédula de Habitabilidad nº <strong>{data.property.habitabilityCert || '___'}</strong> y 
            Certificado de Eficiencia Energética <strong>{data.property.energyCert || '___'}</strong>.
            {data.property.description && (
                <span> Se incluye en el arrendamiento: {data.property.description}.</span>
            )}
            <br/>
            (En adelante, el "<strong>Inmueble</strong>").
          </li>
          <li>
            Que la Parte Arrendataria está interesada en el arrendamiento del Inmueble para destinarlo a su vivienda habitual y permanente.
          </li>
          <li>
            Que estando interesadas ambas partes, acuerdan suscribir el presente Contrato con sujeción a las siguientes:
          </li>
        </ol>
      </div>

      <div className="mb-8">
        <h2 className="font-bold uppercase border-b-2 border-black mb-6 pb-1">CLÁUSULAS</h2>

        {/* PRIMERA */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">PRIMERA.- OBJETO Y DESTINO.</h3>
          <p className="mb-2">
            La Parte Arrendadora cede en arrendamiento a la Parte Arrendataria el uso del Inmueble descrito en el Expositivo I.
            El Inmueble se destinará <strong>exclusivamente a vivienda permanente</strong> de la Parte Arrendataria y su familia, 
            sin que pueda destinarse a otro uso, ni a actividad comercial, industrial o profesional alguna.
          </p>
          <p>
             Queda expresamente prohibido el subarrendamiento total o parcial de la vivienda, así como la cesión del contrato, 
             sin el consentimiento previo y por escrito de la Parte Arrendadora. El incumplimiento de esta prohibición dará 
             lugar a la resolución del contrato. La ocupación máxima permitida es de <strong>{data.property.maxOccupancy}</strong> personas.
          </p>
        </div>

        {/* SEGUNDA */}
        <div className="mb-6">
            <h3 className="font-bold mb-2">SEGUNDA.- DURACIÓN Y PRÓRROGAS.</h3>
            <p className="mb-2">
                El plazo de duración del presente contrato es de <strong>UN (1) AÑO</strong>, a contar desde el día <strong>{formatDate(data.property.date)}</strong>.
            </p>
            <p className="mb-2">
                Llegado el vencimiento del contrato, este se prorrogará obligatoriamente por plazos anuales hasta que el arrendamiento alcance 
                una duración mínima de cinco (5) años (o siete años si el arrendador fuese persona jurídica), salvo que la Parte Arrendataria manifieste 
                a la Parte Arrendadora, con treinta días de antelación como mínimo a la fecha de terminación del contrato o de cualquiera de las prórrogas, 
                su voluntad de no renovarlo.
            </p>
            <p>
                <strong>Desistimiento:</strong> La Parte Arrendataria podrá desistir del contrato de arrendamiento, una vez que hayan transcurrido al menos 
                seis meses, siempre que se lo comunique a la Parte Arrendadora con una antelación mínima de treinta días.
            </p>
        </div>

        {/* TERCERA */}
        <div className="mb-6">
            <h3 className="font-bold mb-2">TERCERA.- RENTA Y PAGO.</h3>
            <p className="mb-2">
                La renta anual se fija en <strong>{money(data.financials.annualRent)} EUROS</strong>, pagadera en mensualidades anticipadas de <strong>{money(data.financials.monthlyRent)} EUROS</strong>.
            </p>
            <p className="mb-2">
                El pago se efectuará dentro de los 7 primeros días de cada mes.
                {data.financials.paymentMethod === PaymentMethod.TRANSFER 
                    ? ` El ingreso se realizará mediante transferencia bancaria a la cuenta IBAN ${data.financials.bankAccount} de la que es titular ${data.financials.bankAccountHolder || 'la Parte Arrendadora'}, en la entidad ${data.financials.bankEntity}.`
                    : ` El pago se realizará mediante domiciliación bancaria en la cuenta facilitada por la Parte Arrendataria: ${data.financials.bankAccount} (Entidad: ${data.financials.bankEntity}).`
                }
            </p>
            <p>
                El impago de una sola mensualidad dará derecho a la Parte Arrendadora a instar el desahucio y la resolución del contrato.
            </p>
        </div>

        {/* CUARTA */}
        <div className="mb-6">
            <h3 className="font-bold mb-2">CUARTA.- ACTUALIZACIÓN DE LA RENTA.</h3>
            <p>
                {data.options.rentUpdate === RentUpdateOption.NO_UPDATE && 'La renta no se actualizará durante la vigencia del contrato.'}
                {data.options.rentUpdate === RentUpdateOption.UPDATE_IRAV && 'La renta se actualizará anualmente, en la fecha en que se cumpla cada año de vigencia de contrato, aplicando a la renta correspondiente a la anualidad anterior la variación porcentual experimentada por el Índice General Nacional del Sistema de Índices de Precios de Consumo (IPC) o el índice que lo sustituya (ej. I.R.A.V si procede legalmente).'}
                {data.options.rentUpdate === RentUpdateOption.NEGATIVE_LIMIT && 'La renta se actualizará anualmente según IPC, sin que en ningún caso pueda resultar una renta inferior a la del año anterior (actualización solo al alza).'}
            </p>
        </div>

        {/* QUINTA */}
        <div className="mb-6">
            <h3 className="font-bold mb-2">QUINTA.- FIANZA LEGAL Y GARANTÍAS.</h3>
            <p className="mb-2">
                A la firma del presente contrato, la Parte Arrendataria entrega a la Parte Arrendadora el importe de <strong>{money(data.financials.depositAmount)} EUROS</strong>, 
                equivalente a {data.financials.depositMonths} mensualidad(es) de renta, en concepto de <strong>FIANZA LEGAL</strong>. 
                El saldo de la fianza será devuelto a la finalización del contrato, previa comprobación del estado de la vivienda y del cumplimiento de las obligaciones contractuales.
            </p>
            {data.financials.guaranteeType !== 'none' && (
                <p>
                    Adicionalmente, se entrega en concepto de <strong>GARANTÍA ADICIONAL</strong> la cantidad de <strong>{money(data.financials.guaranteeAmount)} EUROS</strong> 
                    ({data.financials.guaranteeType === 'cash' ? 'en efectivo metálico' : data.financials.guaranteeType === 'bank_guarantee' ? 'mediante Aval Bancario' : 'mediante transferencia'}).
                    Esta garantía responde del cumplimiento de todas las obligaciones del arrendatario.
                </p>
            )}
        </div>

        {/* SEXTA */}
        <div className="mb-6">
            <h3 className="font-bold mb-2">SEXTA.- GASTOS INDIVIDUALES Y GENERALES.</h3>
            <p className="mb-2">
                6.1. <strong>Suministros:</strong> Los gastos por servicios con que cuente el Inmueble que se individualicen mediante aparatos contadores (luz, agua, gas, teléfono, internet, etc.) 
                serán de cuenta exclusiva de la Parte Arrendataria.
            </p>
            <p className="mb-2">
                6.2. <strong>Gastos Generales:</strong>
            </p>
            <ul className="list-disc pl-8 mb-2">
                <li>
                    Gastos de Comunidad: Serán abonados por {data.expenses.communityFeesPayer === ExpensePayer.LANDLORD ? 'la Parte Arrendadora.' : 
                    `la Parte Arrendataria. Se hace constar que el importe mensual actual asciende a ${money(data.expenses.communityFeesAmount)} €, revisable anualmente.`}
                </li>
                <li>
                    Impuesto de Bienes Inmuebles (IBI): Será abonado por {data.expenses.ibiPayer === ExpensePayer.LANDLORD ? 'la Parte Arrendadora.' : 
                    `la Parte Arrendataria. El importe anual actual es de ${money(data.expenses.ibiAmount)} €, pagadero por prorrateo mensual o a la presentación del recibo.`}
                </li>
                <li>
                     Tasa de Basuras: Será de cuenta de {data.expenses.garbageTaxPayer === ExpensePayer.LANDLORD ? 'la Parte Arrendadora.' : 'la Parte Arrendataria.'}
                </li>
            </ul>
        </div>

        {/* SEPTIMA */}
        <div className="mb-6">
            <h3 className="font-bold mb-2">SÉPTIMA.- ESTADO DE LA VIVIENDA, OBRAS Y CONSERVACIÓN.</h3>
            <p className="mb-2">
                La Parte Arrendataria declara recibir el Inmueble en perfecto estado de conservación y habitabilidad, así como los muebles y electrodomésticos descritos 
                {data.options.hasInventory ? ' en el Inventario adjunto (Anexo I),' : ''} obligándose a devolverlos en el mismo estado al término del contrato, salvo el deterioro normal por el uso.
            </p>
            <p className="mb-2">
                <strong>Obras:</strong> Queda prohibida la realización de obras modificativas de la configuración de la vivienda sin autorización escrita de la Propiedad.
            </p>
            <p className="mb-2">
                <strong>Reparaciones:</strong> Serán de cuenta de la Parte Arrendadora las reparaciones necesarias para conservar la vivienda en condiciones de habitabilidad, 
                salvo cuando el deterioro sea imputable a la Parte Arrendataria. Serán cargo de la Parte Arrendataria las <strong>pequeñas reparaciones</strong> que exija el desgaste por el uso ordinario de la vivienda.
            </p>
             <p className="mb-2">
                 Se entregan en este acto <strong>{data.property.keysCount}</strong> juegos de llaves. La pérdida de las llaves y el cambio de cerradura correrá a cargo de la Parte Arrendataria.
            </p>
             <p>
                 <strong>Mobiliario:</strong> {data.options.furniture === FurnitureOption.EMPTY ? 'Vivienda sin amueblar.' : 'Vivienda amueblada.'}
             </p>
        </div>

        {/* OCTAVA */}
        <div className="mb-6">
             <h3 className="font-bold mb-2">OCTAVA.- NORMAS DE CONVIVENCIA Y ANIMALES.</h3>
             <p className="mb-2">
                 La Parte Arrendataria se compromete a cumplir los estatutos y normas de la Comunidad de Propietarios, respetando el descanso de los vecinos.
             </p>
             <p>
                 Respecto a la tenencia de animales en la vivienda: 
                 {data.options.pets === PetOption.FORBIDDEN 
                 ? <strong> Queda terminantemente PROHIBIDA la tenencia de animales de cualquier especie en el inmueble.</strong>
                 : ' Se AUTORIZA la tenencia de animales domésticos, siendo la Parte Arrendataria responsable de los daños que pudieran ocasionar.'}
             </p>
        </div>

        {/* NOVENA */}
        <div className="mb-6">
            <h3 className="font-bold mb-2">NOVENA.- RENUNCIA A DERECHOS.</h3>
            <p>
                La Parte Arrendataria renuncia expresamente a los derechos de tanteo y retracto sobre la vivienda arrendada en caso de venta de la misma, 
                de conformidad con el artículo 25.8 de la LAU.
            </p>
        </div>

         {/* DECIMA */}
         {guarantors.length > 0 && (
            <div className="mb-6">
                <h3 className="font-bold mb-2">DÉCIMA.- AVALISTA.</h3>
                <p>
                    La Parte Avalista, D./Dña. {guarantors.map(g => g.fullName).join(', ')}, se constituye en fiador solidario de todas las obligaciones 
                    asumidas por la Parte Arrendataria en este contrato, renunciando expresamente a los beneficios de orden, excusión y división, 
                    extendiendo su aval a la duración del contrato y sus prórrogas.
                </p>
            </div>
         )}

        {/* UNDECIMA */}
        <div className="mb-6">
            <h3 className="font-bold mb-2">{guarantors.length > 0 ? 'UNDÉCIMA' : 'DÉCIMA'}.- JURISDICCIÓN.</h3>
            <p>
                Para la resolución de cualquier conflicto que pudiera derivarse de la interpretación o cumplimiento del presente contrato, 
                las partes se someten a los Juzgados y Tribunales de la ciudad donde radica la finca, renunciando a cualquier otro fuero que pudiera corresponderles.
            </p>
        </div>

        <p className="mt-12 mb-8">
            Y en prueba de conformidad, las partes firman el presente documento por duplicado ejemplar y a un solo efecto, en el lugar y fecha indicados en el encabezamiento.
        </p>

        <div className="flex justify-between items-start gap-8 mt-16 page-break-inside-avoid">
            <div className="flex-1 text-center">
                <div className="border-t border-black pt-4 mb-2 font-bold">LA PARTE ARRENDADORA</div>
                <div className="text-sm italic text-gray-500">(Firma)</div>
            </div>
            
            {guarantors.length > 0 && (
                 <div className="flex-1 text-center">
                    <div className="border-t border-black pt-4 mb-2 font-bold">LA PARTE AVALISTA</div>
                    <div className="text-sm italic text-gray-500">(Firma)</div>
                 </div>
            )}
            
            <div className="flex-1 text-center">
                <div className="border-t border-black pt-4 mb-2 font-bold">LA PARTE ARRENDATARIA</div>
                <div className="text-sm italic text-gray-500">(Firma)</div>
            </div>
        </div>

    </div>
  );
};