import React, { useState } from 'react';
import { 
  PartyType, 
  ConfigCounts, 
  ContractData, 
  Party, 
  PetOption, 
  FurnitureOption, 
  PaymentMethod, 
  RentUpdateOption,
  ExpensePayer
} from './types';
import { Input, Select } from './components/ui/Input';
import { ContractPreview } from './components/ContractPreview';
import { validateDNI, validateEmail, validateIBAN, validatePhone } from './utils/validators';
import { FileText, Users, Home, Euro, Printer, Check, ChevronRight, ChevronLeft } from 'lucide-react';

const INITIAL_DATA: ContractData = {
  parties: [],
  property: {
    location: '', date: new Date().toISOString().split('T')[0], address: '', description: '',
    catastralRef: '', community: '', habitabilityCert: '', energyCert: '', maxOccupancy: 2, keysCount: 2
  },
  financials: {
    annualRent: 0, monthlyRent: 0, paymentMethod: PaymentMethod.TRANSFER,
    bankAccount: '', bankAccountHolder: '', bankEntity: '', depositAmount: 0, depositMonths: 1,
    guaranteeType: 'none', guaranteeAmount: 0
  },
  expenses: {
    communityFeesPayer: ExpensePayer.LANDLORD,
    ibiPayer: ExpensePayer.LANDLORD,
    garbageTaxPayer: ExpensePayer.TENANT
  },
  options: {
    pets: PetOption.FORBIDDEN,
    furniture: FurnitureOption.KITCHEN_EQUIPPED,
    rentUpdate: RentUpdateOption.UPDATE_IRAV,
    hasInventory: false
  }
};

const Steps = [
  { id: 1, title: 'Configuración', icon: Users },
  { id: 2, title: 'Intervinientes', icon: Users },
  { id: 3, title: 'Inmueble', icon: Home },
  { id: 4, title: 'Condiciones', icon: Euro },
  { id: 5, title: 'Revisión', icon: FileText }
];

function App() {
  const [step, setStep] = useState(1);
  const [counts, setCounts] = useState<ConfigCounts>({ landlords: 1, tenants: 1, guarantors: 0 });
  const [formData, setFormData] = useState<ContractData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCounts(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const initParties = () => {
    if (step === 1) {
      // Initialize parties array based on counts if moving from step 1
      const newParties: Party[] = [];
      const createParty = (type: PartyType, i: number): Party => ({
        id: `${type}-${i}`, type, fullName: '', nationality: 'Española', address: '',
        docNumber: '', phone: '', email: ''
      });

      for (let i = 0; i < counts.landlords; i++) newParties.push(createParty(PartyType.LANDLORD, i));
      for (let i = 0; i < counts.tenants; i++) newParties.push(createParty(PartyType.TENANT, i));
      for (let i = 0; i < counts.guarantors; i++) newParties.push(createParty(PartyType.GUARANTOR, i));

      setFormData(prev => ({ ...prev, parties: newParties }));
      setStep(2);
    }
  };

  const updateParty = (index: number, field: keyof Party, value: string) => {
    const newParties = [...formData.parties];
    newParties[index] = { ...newParties[index], [field]: value };
    setFormData({ ...formData, parties: newParties });
    
    // Clear error on change
    if (errors[`party-${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`party-${index}-${field}`];
      setErrors(newErrors);
    }
  };

  const updateNested = (section: keyof ContractData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section as any], [field]: value }
    }));
    // Clear validation error if specific field logic exists
    if (field === 'bankAccount' || field === 'monthlyRent') {
        if(errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
    }
    // Auto calc annual
    if (field === 'monthlyRent') {
         setFormData(prev => ({
            ...prev,
            financials: { ...prev.financials, monthlyRent: value, annualRent: value * 12 }
        }));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 2) {
      formData.parties.forEach((p, idx) => {
        if (!p.fullName) newErrors[`party-${idx}-fullName`] = 'Requerido';
        if (!p.docNumber) newErrors[`party-${idx}-docNumber`] = 'Requerido';
        else if (!validateDNI(p.docNumber)) newErrors[`party-${idx}-docNumber`] = 'DNI/NIE inválido';
        
        if (p.phone && !validatePhone(p.phone)) newErrors[`party-${idx}-phone`] = 'Teléfono inválido';
        if (p.email && !validateEmail(p.email)) newErrors[`party-${idx}-email`] = 'Email inválido';
      });
    }

    if (step === 3) {
      if (!formData.property.address) newErrors['address'] = 'Requerido';
      if (!formData.property.location) newErrors['location'] = 'Requerido';
      if (!formData.property.catastralRef) newErrors['catastralRef'] = 'Requerido';
    }

    if (step === 4) {
      if (!formData.financials.monthlyRent) newErrors['monthlyRent'] = 'Requerido';
      if (formData.financials.bankAccount && !validateIBAN(formData.financials.bankAccount)) {
        newErrors['bankAccount'] = 'IBAN inválido';
      }
      
      // Validate expenses amounts if tenant pays
      if (formData.expenses.communityFeesPayer === ExpensePayer.TENANT && !formData.expenses.communityFeesAmount) {
           newErrors['communityFeesAmount'] = 'Requerido si paga inquilino';
      }
      if (formData.expenses.ibiPayer === ExpensePayer.TENANT && !formData.expenses.ibiAmount) {
           newErrors['ibiAmount'] = 'Requerido si paga inquilino';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    } else {
      setErrors({});
    }
    return isValid;
  };

  const nextStep = () => {
    if (step === 1) {
      initParties(); // Step update happens inside
    } else {
      if (validateStep()) setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar / Progress */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex-shrink-0 no-print">
        <h1 className="text-xl font-bold mb-8 flex items-center gap-2">
          <FileText className="text-blue-400" />
          Contrato Alquiler
        </h1>
        <nav className="space-y-4">
          {Steps.map((s) => (
            <div 
              key={s.id} 
              className={`flex items-center gap-3 p-2 rounded transition-colors ${step === s.id ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              <s.icon size={18} />
              <span className="text-sm font-medium">{s.title}</span>
              {step > s.id && <Check size={16} className="ml-auto text-green-400" />}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <div className="max-w-4xl mx-auto p-6 md:p-12">
          
          {/* Step 1: Config */}
          {step === 1 && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Configuración Inicial</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input 
                  label="Nº Arrendadores (Propietarios)" 
                  type="number" min="1" 
                  name="landlords"
                  value={counts.landlords} 
                  onChange={handleConfigChange} 
                />
                <Input 
                  label="Nº Arrendatarios (Inquilinos)" 
                  type="number" min="1" 
                  name="tenants"
                  value={counts.tenants} 
                  onChange={handleConfigChange} 
                />
                <Input 
                  label="Nº Avalistas" 
                  type="number" min="0" 
                  name="guarantors"
                  value={counts.guarantors} 
                  onChange={handleConfigChange} 
                />
              </div>
              <p className="text-sm text-slate-500 mt-4 bg-blue-50 p-4 rounded-lg">
                Indique cuántas personas firmarán en cada rol. En el siguiente paso se pedirán los datos personales de cada uno.
              </p>
            </div>
          )}

          {/* Step 2: Parties */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800">Datos de los Intervinientes</h2>
              {formData.parties.map((party, index) => (
                <div key={party.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-semibold text-lg text-blue-700 mb-4 border-b pb-2">
                    {party.type} #{index + 1}
                    {party.type === PartyType.GUARANTOR ? ' (Avalista)' : ''}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Nombre Completo" 
                      value={party.fullName} required
                      onChange={(e) => updateParty(index, 'fullName', e.target.value)}
                      error={errors[`party-${index}-fullName`]}
                    />
                    <Input 
                      label="DNI / NIE" 
                      value={party.docNumber} required
                      onChange={(e) => updateParty(index, 'docNumber', e.target.value)}
                      error={errors[`party-${index}-docNumber`]}
                      placeholder="12345678X"
                    />
                    <Input 
                      label="Nacionalidad" 
                      value={party.nationality} 
                      onChange={(e) => updateParty(index, 'nationality', e.target.value)}
                    />
                    <Input 
                      label="Domicilio Actual" 
                      value={party.address} 
                      onChange={(e) => updateParty(index, 'address', e.target.value)}
                    />
                    <Input 
                      label="Teléfono" 
                      value={party.phone} type="tel"
                      onChange={(e) => updateParty(index, 'phone', e.target.value)}
                      error={errors[`party-${index}-phone`]}
                    />
                    <Input 
                      label="Email" 
                      value={party.email} type="email"
                      onChange={(e) => updateParty(index, 'email', e.target.value)}
                      error={errors[`party-${index}-email`]}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Property */}
          {step === 3 && (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Datos del Inmueble</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input 
                  label="Lugar de firma (Ciudad)" required
                  value={formData.property.location} 
                  onChange={(e) => updateNested('property', 'location', e.target.value)}
                  error={errors['location']}
                />
                <Input 
                  label="Fecha del Contrato" type="date" required
                  value={formData.property.date} 
                  onChange={(e) => updateNested('property', 'date', e.target.value)}
                />
                <Input 
                  label="Dirección Completa de la Vivienda" className="md:col-span-2" required
                  value={formData.property.address} 
                  onChange={(e) => updateNested('property', 'address', e.target.value)}
                  error={errors['address']}
                />
                <Input 
                  label="Descripción Adicional (Garaje, Trastero...)" className="md:col-span-2"
                  value={formData.property.description} 
                  onChange={(e) => updateNested('property', 'description', e.target.value)}
                />
                <Input 
                  label="Referencia Catastral" required
                  value={formData.property.catastralRef} 
                  onChange={(e) => updateNested('property', 'catastralRef', e.target.value)}
                  error={errors['catastralRef']}
                />
                <Input 
                  label="Comunidad de Propietarios" 
                  placeholder="Ej: Si, forma parte de..."
                  value={formData.property.community} 
                  onChange={(e) => updateNested('property', 'community', e.target.value)}
                />
                <Input 
                  label="Cédula Habitabilidad" 
                  value={formData.property.habitabilityCert} 
                  onChange={(e) => updateNested('property', 'habitabilityCert', e.target.value)}
                />
                <Input 
                  label="Cert. Eficiencia Energética" 
                  value={formData.property.energyCert} 
                  onChange={(e) => updateNested('property', 'energyCert', e.target.value)}
                />
                <Input 
                  label="Ocupación Máxima (Personas)" type="number"
                  value={formData.property.maxOccupancy} 
                  onChange={(e) => updateNested('property', 'maxOccupancy', parseInt(e.target.value))}
                />
                <Input 
                  label="Juegos de llaves entregados" type="number"
                  value={formData.property.keysCount} 
                  onChange={(e) => updateNested('property', 'keysCount', parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Step 4: Terms */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
                
              {/* Options */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Condiciones Generales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select 
                    label="Mascotas"
                    value={formData.options.pets}
                    onChange={(e) => updateNested('options', 'pets', e.target.value)}
                    options={[
                        { value: PetOption.FORBIDDEN, label: 'Prohibidas' },
                        { value: PetOption.ALLOWED, label: 'Permitidas' }
                    ]}
                  />
                   <Select 
                    label="Mobiliario / Cocina"
                    value={formData.options.furniture}
                    onChange={(e) => updateNested('options', 'furniture', e.target.value)}
                    options={[
                        { value: FurnitureOption.EMPTY, label: 'Vacía (Cocina no equipada)' },
                        { value: FurnitureOption.KITCHEN_EQUIPPED, label: 'Cocina Equipada (Sin muebles)' },
                        { value: FurnitureOption.FURNISHED, label: 'Amueblada y Equipada' }
                    ]}
                  />
                  <div className="flex items-center mt-6">
                    <input 
                        type="checkbox" 
                        id="hasInv" 
                        checked={formData.options.hasInventory}
                        onChange={(e) => updateNested('options', 'hasInventory', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="hasInv" className="ml-2 text-sm text-slate-700">Se adjunta Inventario</label>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Económico</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Renta Mensual (€)" type="number" required
                    value={formData.financials.monthlyRent} 
                    onChange={(e) => updateNested('financials', 'monthlyRent', parseFloat(e.target.value))}
                    error={errors['monthlyRent']}
                  />
                   <Input 
                    label="Renta Anual (€)" type="number" disabled
                    value={formData.financials.annualRent} 
                  />
                  <Select 
                    label="Forma de Pago"
                    value={formData.financials.paymentMethod}
                    onChange={(e) => updateNested('financials', 'paymentMethod', e.target.value)}
                    options={[
                        { value: PaymentMethod.TRANSFER, label: 'Transferencia Bancaria' },
                        { value: PaymentMethod.DIRECT_DEBIT, label: 'Domiciliación' }
                    ]}
                  />
                   <Select 
                    label="Actualización Renta"
                    value={formData.options.rentUpdate}
                    onChange={(e) => updateNested('options', 'rentUpdate', e.target.value)}
                    options={[
                        { value: RentUpdateOption.UPDATE_IRAV, label: 'Actualizar segun IRAV' },
                        { value: RentUpdateOption.NO_UPDATE, label: 'Sin Actualización' },
                        { value: RentUpdateOption.NEGATIVE_LIMIT, label: 'Actualizar (Sin bajar)' }
                    ]}
                  />
                </div>
                
                <h4 className="font-semibold text-sm text-slate-600 mt-4 mb-2 uppercase tracking-wide">Datos Bancarios</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        label="IBAN" required
                        value={formData.financials.bankAccount} 
                        onChange={(e) => updateNested('financials', 'bankAccount', e.target.value)}
                        error={errors['bankAccount']}
                        placeholder="ES..."
                    />
                    <Input 
                        label="Entidad Bancaria"
                        value={formData.financials.bankEntity} 
                        onChange={(e) => updateNested('financials', 'bankEntity', e.target.value)}
                    />
                    <Input 
                        label="Titular Cuenta" className="md:col-span-2"
                        value={formData.financials.bankAccountHolder} 
                        onChange={(e) => updateNested('financials', 'bankAccountHolder', e.target.value)}
                    />
                </div>
              </div>
                
              {/* Expenses */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800 mb-4">Gastos y Fianza</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Select 
                            label="Comunidad paga"
                            value={formData.expenses.communityFeesPayer}
                            onChange={(e) => updateNested('expenses', 'communityFeesPayer', e.target.value)}
                            options={[{value: ExpensePayer.LANDLORD, label: 'Propietario'}, {value: ExpensePayer.TENANT, label: 'Inquilino'}]}
                        />
                        {formData.expenses.communityFeesPayer === ExpensePayer.TENANT && (
                             <Input 
                             label="Importe Mensual Comunidad (€)" type="number" required
                             value={formData.expenses.communityFeesAmount}
                             onChange={(e) => updateNested('expenses', 'communityFeesAmount', parseFloat(e.target.value))}
                             error={errors['communityFeesAmount']}
                           />
                        )}
                    </div>

                     <div className="space-y-2">
                        <Select 
                            label="IBI paga"
                            value={formData.expenses.ibiPayer}
                            onChange={(e) => updateNested('expenses', 'ibiPayer', e.target.value)}
                            options={[{value: ExpensePayer.LANDLORD, label: 'Propietario'}, {value: ExpensePayer.TENANT, label: 'Inquilino'}]}
                        />
                         {formData.expenses.ibiPayer === ExpensePayer.TENANT && (
                             <Input 
                             label="Importe Anual IBI (€)" type="number" required
                             value={formData.expenses.ibiAmount}
                             onChange={(e) => updateNested('expenses', 'ibiAmount', parseFloat(e.target.value))}
                             error={errors['ibiAmount']}
                           />
                        )}
                    </div>

                     <Select 
                        label="Basuras paga"
                        value={formData.expenses.garbageTaxPayer}
                        onChange={(e) => updateNested('expenses', 'garbageTaxPayer', e.target.value)}
                        options={[{value: ExpensePayer.LANDLORD, label: 'Propietario'}, {value: ExpensePayer.TENANT, label: 'Inquilino'}]}
                    />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Input 
                        label="Fianza (Importe €)" type="number"
                        value={formData.financials.depositAmount} 
                        onChange={(e) => updateNested('financials', 'depositAmount', parseFloat(e.target.value))}
                    />
                    <Input 
                        label="Meses Fianza" type="number"
                        value={formData.financials.depositMonths} 
                        onChange={(e) => updateNested('financials', 'depositMonths', parseFloat(e.target.value))}
                    />
                 </div>
              </div>

            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="animate-fade-in">
               <div className="flex justify-between items-center mb-6 no-print">
                   <h2 className="text-2xl font-bold text-slate-800">Vista Previa</h2>
                   <button 
                    onClick={() => window.print()} 
                    className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                   >
                       <Printer size={18} />
                       Imprimir / Guardar PDF
                   </button>
               </div>
               
               {/* Wrapper to ensure print styles apply correctly */}
               <div className="border border-slate-200 shadow-xl print:border-none print:shadow-none">
                   <ContractPreview data={formData} />
               </div>
            </div>
          )}

          {/* Navigation Buttons (Hidden on Print) */}
          <div className="mt-8 flex justify-between no-print">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors
                ${step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-200'}
              `}
            >
              <ChevronLeft size={20} className="mr-2" />
              Anterior
            </button>
            
            {step < 5 && (
                <button
                onClick={nextStep}
                className="flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 shadow-md transition-all hover:shadow-lg"
                >
                Siguiente
                <ChevronRight size={20} className="ml-2" />
                </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;