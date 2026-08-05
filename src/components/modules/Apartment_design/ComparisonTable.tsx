import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, Plus, Layers, Building2, Check, GripVertical } from 'lucide-react';
import { comparisonRows } from './mockData';
import TaxRulesModal from './TaxRulesModal';
import { PreviousAssessmentTable, CurrentSurveyTable } from './ComparisonSubTables';

function getStatusBgClass(status: string) {
  return '';
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Matched':
      return 'bg-green-50 text-green-600 border border-green-200/50';
    case 'Modified':
      return 'bg-amber-50 text-amber-600 border border-amber-200/50';
    case 'New':
      return 'bg-blue-50 text-blue-600 border border-blue-200/50';
    case 'Missing':
      return 'bg-red-50 text-red-600 border border-red-200/50';
    default:
      return 'bg-gray-50 text-gray-500 border border-gray-200/50';
  }
}

function getOwnerName(prop: string) {
  const names: { [key: string]: string } = {
    "102": "Rahul Sharma",
    "103": "Amit Patel",
    "201": "Sneha Reddy",
    "S-01": "Karan Gupta",
    "S-02": "Vikram Singh",
    "S-03": "Sunita Rao",
    "104": "Rajesh Kumar",
    "105": "Priya Nair",
    "106": "Anil Deshmukh"
  };
  return names[prop] || "Owner " + prop;
}

function ApplyOcPanel() {
  const [activeMode, setActiveMode] = useState<'building' | 'wing' | 'flat'>('building');
  const [submitted, setSubmitted] = useState(false);
  const [docketNum, setDocketNum] = useState('OC-TMC-2026-904');
  const [issueDate, setIssueDate] = useState('2026-08-03');
  const [selectedWing, setSelectedWing] = useState('B Wing');
  const [flatNum, setFlatNum] = useState('103');
  const [fireCompliant, setFireCompliant] = useState(true);
  const [waterAttached, setWaterAttached] = useState(true);
  const [drainageCert, setDrainageCert] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    alert(`Successfully applied Occupancy Certificate ${docketNum} for the ${activeMode === 'building' ? 'entire building' : activeMode === 'wing' ? selectedWing : selectedWing + ' Flat ' + flatNum}!`);
  };

  return (
    <div className="w-full flex flex-col bg-white p-4 font-sans select-none animate-fadeIn">
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-blue-600" />
          <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase tracking-wider">Apply Occupancy Certificate (OC)</h3>
        </div>
        <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">OC Audit Portal</span>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-10 max-w-lg mx-auto text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200 shadow-xs animate-scaleIn">
            <Check size={28} className="stroke-[3]" />
          </div>
          <span className="font-black text-sm text-[#006a4e] uppercase mt-2">OC Applied Successfully!</span>
          <p className="text-[10.5px] text-gray-500 font-semibold leading-relaxed max-w-md">
            Occupancy Certificate has been registered and locked under docket **{docketNum}** for {
              activeMode === 'building' ? 'the entire Shivam Residency Building' : 
              activeMode === 'wing' ? `all units in ${selectedWing}` : 
              `Unit ${flatNum} in ${selectedWing}`
            }.
          </p>
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-3 w-full text-left text-[9.5px] space-y-1 mt-2">
            <div><span className="text-gray-400 font-bold">Docket Number:</span> <span className="font-black text-gray-700">{docketNum}</span></div>
            <div><span className="text-gray-400 font-bold">Issue Date:</span> <span className="font-black text-gray-700">{issueDate}</span></div>
            <div><span className="text-gray-400 font-bold">Compliance Status:</span> <span className="font-black text-green-600">VERIFIED</span></div>
          </div>
          <button 
            type="button"
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-6 py-2 rounded-lg mt-4 uppercase cursor-pointer tracking-wide transition shadow-3xs"
          >
            Apply Another OC
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Form options & parameters (7 cols) */}
          <form onSubmit={handleSubmit} className="md:col-span-7 flex flex-col gap-4">
            
            {/* Mode selection strip */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wide">Select OC Target Mode</span>
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1 rounded-xl border border-gray-205">
                <button
                  type="button"
                  onClick={() => setActiveMode('building')}
                  className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeMode === 'building' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-150/70 hover:text-gray-700'
                  }`}
                >
                  Building-wise
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('wing')}
                  className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeMode === 'wing' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-150/70 hover:text-gray-700'
                  }`}
                >
                  Wing-wise
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('flat')}
                  className={`py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                    activeMode === 'flat' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-150/70 hover:text-gray-700'
                  }`}
                >
                  Flat-wise
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">OC Docket / Cert Number *</span>
                <input 
                  type="text" 
                  required
                  value={docketNum}
                  onChange={(e) => setDocketNum(e.target.value)}
                  className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 shadow-3xs"
                  placeholder="e.g. OC-TMC-2026-904"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Date of Certificate Issuance *</span>
                <input 
                  type="date" 
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 shadow-3xs"
                />
              </div>

              {activeMode === 'wing' && (
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Select Target Wing *</span>
                  <select 
                    value={selectedWing}
                    onChange={(e) => setSelectedWing(e.target.value)}
                    className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer shadow-3xs"
                  >
                    <option>A Wing</option>
                    <option>B Wing</option>
                    <option>C Wing</option>
                    <option>D Wing</option>
                  </select>
                </div>
              )}

              {activeMode === 'flat' && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Select Target Wing *</span>
                    <select 
                      value={selectedWing}
                      onChange={(e) => setSelectedWing(e.target.value)}
                      className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer shadow-3xs"
                    >
                      <option>A Wing</option>
                      <option>B Wing</option>
                      <option>C Wing</option>
                      <option>D Wing</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">Flat / Shop Number *</span>
                    <input 
                      type="text" 
                      required
                      value={flatNum}
                      onChange={(e) => setFlatNum(e.target.value)}
                      className="bg-white border border-gray-250 rounded-lg px-3 py-1.5 text-[10.5px] font-bold text-gray-700 outline-none focus:border-blue-500 shadow-3xs"
                      placeholder="e.g. 103"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Checkbox checks */}
            <div className="flex flex-col gap-2 mt-2 bg-slate-50/50 p-3 rounded-xl border border-gray-150 text-[10px] font-semibold text-slate-700">
              <span className="text-[8.5px] text-slate-400 font-black uppercase tracking-wider mb-1 block">Compliance Checklist</span>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={fireCompliant}
                  onChange={(e) => setFireCompliant(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Fire safety compliance audit signed-off by chief fire officer</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={waterAttached}
                  onChange={(e) => setWaterAttached(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Municipal water and sewerage blueprint links verified</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={drainageCert}
                  onChange={(e) => setDrainageCert(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Environmental clearance certificate & structural stability certificate attached</span>
              </label>
            </div>

            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10.5px] py-2 px-4 rounded-lg cursor-pointer transition uppercase text-center tracking-wider shadow-3xs mt-3.5"
            >
              Submit & Apply Occupancy Certificate
            </button>
          </form>

          {/* Info Panel / Preview Area (5 cols) */}
          <div className="md:col-span-5 bg-slate-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <span className="text-[9.5px] text-slate-500 font-black uppercase tracking-wide block">Auditing Scope Preview</span>
              <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                Applying an Occupancy Certificate locks the assessment records and certifies that the designated area is legally habitable and compliant with municipality laws.
              </p>
              <div className="space-y-2 text-[10px] font-bold text-gray-700">
                <div className="flex justify-between py-1 border-b border-gray-200/70">
                  <span className="text-gray-400">Target Area:</span>
                  <span>{
                    activeMode === 'building' ? 'All Wings (A, B, C, D)' : 
                    activeMode === 'wing' ? `${selectedWing} Total` : 
                    `${selectedWing} - Unit ${flatNum}`
                  }</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200/70">
                  <span className="text-gray-400">Affected Properties:</span>
                  <span className="text-blue-700">{
                    activeMode === 'building' ? '67 Units' : 
                    activeMode === 'wing' ? (selectedWing === 'A Wing' || selectedWing === 'B Wing' ? '19 Units' : selectedWing === 'C Wing' ? '15 Units' : '14 Units') : 
                    '1 Unit'
                  }</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-400">Audit Status:</span>
                  <span className="text-orange-500 uppercase">Awaiting Submission</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[9.5px] text-blue-800 leading-normal font-semibold">
              <strong>Notice:</strong> Once applied, tax computation rates will automatically transition to occupied status multiplier variables where applicable.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ComparisonTableProps {
  selectedWing?: string;
  selectedFloor?: string;
  areaPolicyThreshold?: string;
  diffFilter?: string;
  activeTab?: string;
}

export default function ComparisonTable({ 
  selectedWing = 'B Wing (19)', 
  selectedFloor = 'All Floors', 
  areaPolicyThreshold = 'all', 
  diffFilter = 'all',
  activeTab = 'floor-comparison'
}: ComparisonTableProps) {
  const [selectedRowForRules, setSelectedRowForRules] = useState<any | null>(null);

  const leftTableRef = useRef<HTMLDivElement>(null);
  const middleTableRef = useRef<HTMLDivElement>(null);
  const rightTableRef = useRef<HTMLDivElement>(null);

  // Resizable panel state (percentages out of 100)
  const DEFAULT_LEFT = 33.33;
  const DEFAULT_MIDDLE = 33.34;
  const DEFAULT_RIGHT = 33.33;
  const MIN_PANEL = 8; // minimum panel width in %
  const MIN_MIDDLE = 8; // minimum for difference engine

  const [panelWidths, setPanelWidths] = useState({ left: DEFAULT_LEFT, middle: DEFAULT_MIDDLE, right: DEFAULT_RIGHT });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<'left' | 'right' | null>(null);
  const dragStartX = useRef(0);
  const dragStartWidths = useRef({ left: DEFAULT_LEFT, middle: DEFAULT_MIDDLE, right: DEFAULT_RIGHT });

  const handleMouseDown = useCallback((divider: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = divider;
    dragStartX.current = e.clientX;
    dragStartWidths.current = { ...panelWidths };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [panelWidths]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const deltaX = e.clientX - dragStartX.current;
    const deltaPct = (deltaX / containerWidth) * 100;
    const start = dragStartWidths.current;

    if (isDragging.current === 'left') {
      // Dragging the left divider: affects left and middle panels
      let newLeft = start.left + deltaPct;
      let newMiddle = start.middle - deltaPct;
      // Clamp
      if (newLeft < MIN_PANEL) { newMiddle += (newLeft - MIN_PANEL); newLeft = MIN_PANEL; }
      if (newMiddle < MIN_MIDDLE) { newLeft += (newMiddle - MIN_MIDDLE); newMiddle = MIN_MIDDLE; }
      // Final safety clamp
      newLeft = Math.max(MIN_PANEL, Math.min(newLeft, 100 - MIN_MIDDLE - MIN_PANEL));
      newMiddle = Math.max(MIN_MIDDLE, Math.min(newMiddle, 100 - MIN_PANEL - MIN_PANEL));
      setPanelWidths({ left: newLeft, middle: newMiddle, right: start.right });
    } else {
      // Dragging the right divider: affects middle and right panels
      let newMiddle = start.middle + deltaPct;
      let newRight = start.right - deltaPct;
      // Clamp
      if (newMiddle < MIN_MIDDLE) { newRight += (newMiddle - MIN_MIDDLE); newMiddle = MIN_MIDDLE; }
      if (newRight < MIN_PANEL) { newMiddle += (newRight - MIN_PANEL); newRight = MIN_PANEL; }
      // Final safety clamp
      newMiddle = Math.max(MIN_MIDDLE, Math.min(newMiddle, 100 - MIN_PANEL - MIN_PANEL));
      newRight = Math.max(MIN_PANEL, Math.min(newRight, 100 - MIN_PANEL - MIN_MIDDLE));
      setPanelWidths({ left: start.left, middle: newMiddle, right: newRight });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const resetPanelWidths = useCallback(() => {
    setPanelWidths({ left: DEFAULT_LEFT, middle: DEFAULT_MIDDLE, right: DEFAULT_RIGHT });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {

    const leftEl = leftTableRef.current;
    const middleEl = middleTableRef.current;
    const rightEl = rightTableRef.current;
    if (!leftEl || !middleEl || !rightEl) return;

    let activeScrollSource: HTMLDivElement | null = null;

    const syncScroll = (source: HTMLDivElement, targets: { el: HTMLDivElement; syncX: boolean; syncY: boolean }[]) => {
      targets.forEach(({ el, syncX, syncY }) => {
        if (syncX && el.scrollLeft !== source.scrollLeft) {
          el.scrollLeft = source.scrollLeft;
        }
        if (syncY && el.scrollTop !== source.scrollTop) {
          el.scrollTop = source.scrollTop;
        }
      });
    };

    const createScrollHandler = (source: HTMLDivElement, targets: { el: HTMLDivElement; syncX: boolean; syncY: boolean }[]) => {
      return () => {
        if (activeScrollSource && activeScrollSource !== source) return;
        activeScrollSource = source;
        syncScroll(source, targets);
        
        // Clear active source when scrolling stops
        clearTimeout((source as any)._scrollTimeout);
        (source as any)._scrollTimeout = setTimeout(() => {
          activeScrollSource = null;
        }, 50);
      };
    };

    const onLeftScroll = createScrollHandler(leftEl, [
      { el: rightEl, syncX: true, syncY: true },
      { el: middleEl, syncX: false, syncY: true }
    ]);

    const onRightScroll = createScrollHandler(rightEl, [
      { el: leftEl, syncX: true, syncY: true },
      { el: middleEl, syncX: false, syncY: true }
    ]);

    const onMiddleScroll = createScrollHandler(middleEl, [
      { el: leftEl, syncX: false, syncY: true },
      { el: rightEl, syncX: false, syncY: true }
    ]);

    leftEl.addEventListener('scroll', onLeftScroll);
    rightEl.addEventListener('scroll', onRightScroll);
    middleEl.addEventListener('scroll', onMiddleScroll);

    return () => {
      leftEl.removeEventListener('scroll', onLeftScroll);
      rightEl.removeEventListener('scroll', onRightScroll);
      middleEl.removeEventListener('scroll', onMiddleScroll);
    };
  }, [selectedWing, selectedFloor, areaPolicyThreshold, diffFilter, activeTab]);

  let activeRows: any[] = [];
  const wingLetter = selectedWing && selectedWing !== "All Wings" ? selectedWing.charAt(0) : 'B';

  if (selectedWing === "All Wings") {
    const wingsList = ['A', 'B', 'C', 'D'];
    wingsList.forEach(w => {
      comparisonRows.forEach(row => {
        if (row.prevWing === "-" && row.currWing === "-") return;
        
        const prevWingMapped = row.prevWing.startsWith('B/') ? row.prevWing.replace('B/', `${w}/`) : (row.prevWing !== "-" ? row.prevWing.replace('B/', `${w}/`) : "-");
        const currWingMapped = row.currWing.startsWith('B/') ? row.currWing.replace('B/', `${w}/`) : (row.currWing !== "-" ? row.currWing.replace('B/', `${w}/`) : "-");

        activeRows.push({
          ...row,
          prevWing: prevWingMapped,
          currWing: currWingMapped,
        });
      });
    });
  } else {
    activeRows = comparisonRows.map(row => {
      const prevWingMapped = row.prevWing.startsWith('B/') ? row.prevWing.replace('B/', `${wingLetter}/`) : row.prevWing;
      const currWingMapped = row.currWing.startsWith('B/') ? row.currWing.replace('B/', `${wingLetter}/`) : row.currWing;
      return {
        ...row,
        prevWing: prevWingMapped,
        currWing: currWingMapped,
      };
    });
  }

  // Map other computed fields
  const processedRows = activeRows.map((row) => {
    const ownerName = row.currProp !== "-" ? getOwnerName(row.currProp) : "-";
    const prevCVVal = row.prevCarpet && row.prevCarpet !== 0 ? row.prevCarpet * 60 : 0;
    const currCVVal = row.currCarpet && row.currCarpet !== 0 ? row.currCarpet * 60 : 0;

    return {
      ...row,
      prevCV: prevCVVal !== 0 ? `₹${prevCVVal.toLocaleString()} L` : "-",
      currCV: currCVVal !== 0 ? `₹${currCVVal.toLocaleString()} L` : "-",
      owner: ownerName,
      ocpr: row.currProp !== "-" ? (row.currRent !== "-" ? "Tenant" : "Self") : "-",
      rntr: row.currProp !== "-" && row.currRent !== "-" ? "Ravi Kumar" : "-",
      shop: row.currType === "Shop" ? `Shop ${row.currProp}` : "-",
      mob: row.currProp !== "-" ? "+91 98765 43210" : "-",
      email: row.currProp !== "-" ? `${ownerName.toLowerCase().replace(' ', '')}@PTIS.gov.in` : "-",
      occDt: row.currProp !== "-" ? "10-Apr-2016" : "-",
      exmp: row.currProp !== "-" ? "None" : "-",
      disc: row.currProp !== "-" ? "10%" : "-",
      rvCvm: "Matched"
    };
  });

  // Apply filters
  const filteredRows = processedRows.filter(row => {
    // 1. Floor Filter
    if (selectedFloor !== 'All Floors') {
      const floorStr = row.currFlr !== '-' ? row.currFlr : row.prevFlr;
      if (selectedFloor === 'Ground Floor' && floorStr !== 'G' && floorStr !== '0') return false;
      if (selectedFloor === '1st Floor' && floorStr !== '1') return false;
      if (selectedFloor === '2nd Floor' && floorStr !== '2') return false;
    }

    // 2. Area Policy Threshold Filter
    if (areaPolicyThreshold !== 'all') {
      const prevArea = row.prevCarpet || 0;
      const currArea = row.currCarpet || 0;
      if (prevArea === 0 || currArea === 0) return false;
      
      const pctDiff = (Math.abs(currArea - prevArea) / prevArea) * 100;
      const thresholdVal = parseFloat(areaPolicyThreshold);
      if (pctDiff < thresholdVal) return false;
    }

    // 3. Diff columns filter
    if (diffFilter !== 'all') {
      if (diffFilter === 'carpet' && (row.diffCarpet || 0) <= 0) return false;
      if (diffFilter === 'bua' && (row.diffBua || 0) <= 0) return false;
      if (diffFilter === 'rv' && (row.diffRv || 0) <= 0) return false;
      if (diffFilter === 'tax' && (row.diffTax || 0) <= 0) return false;
    }

    return true;
  });

  const rows = filteredRows;

  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-xl shadow-xs overflow-hidden bg-white shrink-0">
      {selectedRowForRules && (
        <TaxRulesModal 
          onClose={() => setSelectedRowForRules(null)}
          wing={selectedRowForRules.prevWing !== "-" ? selectedRowForRules.prevWing.split('/')[0] + " Wing" : selectedRowForRules.currWing.split('/')[0] + " Wing"}
          unit={selectedRowForRules.currProp !== "-" ? selectedRowForRules.currProp : selectedRowForRules.prevWing.split('/')[1]}
          use={selectedRowForRules.currUse !== "-" ? selectedRowForRules.currUse : selectedRowForRules.prevUse}
          owner={selectedRowForRules.owner}
          tax={selectedRowForRules.currTax !== "-" ? selectedRowForRules.currTax : selectedRowForRules.prevTax}
        />
      )}

      {activeTab === 'apply-oc' ? (
        <ApplyOcPanel />
      ) : activeTab === 'wing-overview' ? (
        <div className="w-full flex flex-col bg-white p-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 select-none">
            <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase tracking-wider">Wing Stats & Summary Overview</h3>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">4 Wings Configured</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[10.5px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 font-black uppercase tracking-wider h-[32px]">
                  <th className="py-2 px-3">Wing ID</th>
                  <th className="py-2 px-3">Wing Name</th>
                  <th className="py-2 px-3 text-center">Floors</th>
                  <th className="py-2 px-3 text-center">Total Units</th>
                  <th className="py-2 px-3 text-right">Total Surveyed Area</th>
                  <th className="py-2 px-3 text-right">Total Rateable Value</th>
                  <th className="py-2 px-3 text-right">Estimated Annual Tax</th>
                  <th className="py-2 px-3 text-center">OC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-slate-700 font-semibold">
                <tr className="h-[36px]">
                  <td className="py-1.5 px-3 font-black text-[#006a4e]">A Wing</td>
                  <td className="py-1.5 px-3">Krishna Block</td>
                  <td className="py-1.5 px-3 text-center">G + 7</td>
                  <td className="py-1.5 px-3 text-center">19</td>
                  <td className="py-1.5 px-3 text-right">12,456 sqft</td>
                  <td className="py-1.5 px-3 text-right font-black text-blue-700">₹4.39L</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹68,850</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200">APPLIED</span></td>
                </tr>
                <tr className="h-[36px] bg-slate-50/30">
                  <td className="py-1.5 px-3 font-black text-purple-700">B Wing</td>
                  <td className="py-1.5 px-3">Sai Block</td>
                  <td className="py-1.5 px-3 text-center">G + 7</td>
                  <td className="py-1.5 px-3 text-center">19</td>
                  <td className="py-1.5 px-3 text-right">11,920 sqft</td>
                  <td className="py-1.5 px-3 text-right font-black text-blue-700">₹4.12L</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹64,240</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded border border-amber-200">IN PROGRESS</span></td>
                </tr>
                <tr className="h-[36px]">
                  <td className="py-1.5 px-3 font-black text-green-700">C Wing</td>
                  <td className="py-1.5 px-3">Ganesh Block</td>
                  <td className="py-1.5 px-3 text-center">G + 7</td>
                  <td className="py-1.5 px-3 text-center">15</td>
                  <td className="py-1.5 px-3 text-right">9,850 sqft</td>
                  <td className="py-1.5 px-3 text-right font-black text-blue-700">₹3.22L</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹48,560</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200">APPLIED</span></td>
                </tr>
                <tr className="h-[36px] bg-slate-50/30">
                  <td className="py-1.5 px-3 font-black text-orange-700">D Wing</td>
                  <td className="py-1.5 px-3">Lotus Block</td>
                  <td className="py-1.5 px-3 text-center">G + 6</td>
                  <td className="py-1.5 px-3 text-center">14</td>
                  <td className="py-1.5 px-3 text-right">8,400 sqft</td>
                  <td className="py-1.5 px-3 text-right font-black text-blue-700">₹2.88L</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹42,390</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-gray-50 text-gray-500 font-bold px-1.5 py-0.5 rounded border border-gray-200">NOT APPLIED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'tax-comparison' ? (
        <div className="w-full flex flex-col bg-white p-3">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-150 h-[34px] shrink-0 select-none">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-[#1e2b58] text-[10.5px] uppercase tracking-wider leading-none">Headwise Taxes Comparison</h3>
              <span className="text-gray-500 text-[8px] font-bold leading-none">(All Floors Total)</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-50/75 text-gray-500 border border-gray-200/50 px-2.5 py-0.5 rounded-full text-[7.5px] font-semibold leading-none">
              <span>All figures in INR</span>
            </div>
          </div>
          <div className="relative border border-[#002fbe]/15 rounded-md overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] text-center border-collapse">
                <thead className="bg-[#002fbe] border-b border-[#002fbe]/15 text-white font-bold whitespace-nowrap">
                  <tr>
                    <th className="py-2 px-2 text-left sticky left-0 bg-[#002fbe] border-r border-white/10 uppercase text-[8px] font-extrabold z-20 text-white">Taxes</th>
                    <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">General Tax</th>
                    <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">State Education Tax</th>
                    <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Tree Cess</th>
                    <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Special Water Cess</th>
                    <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Road Cess</th>
                    <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Fire Cess</th>
                    <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Light Cess</th>
                    <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Water Benefit Cess</th>
                    <th className="py-2 px-2 border-r border-white/10 uppercase text-[8px] font-extrabold leading-tight text-white">Sewage Disposal Cess</th>
                    <th className="py-2 px-2 uppercase text-[8px] font-extrabold leading-tight text-white">Special Education Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium text-[#1e2b58] whitespace-nowrap bg-white text-center">
                  <tr className="bg-white hover:bg-slate-50 transition-colors duration-150">
                    <td className="py-1.5 px-2 text-left sticky left-0 bg-white border-r border-gray-200 z-10">
                      <span className="text-blue-600 text-[8.5px] font-black uppercase tracking-wider pl-1">Old Taxes</span>
                    </td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 text-slate-800 font-bold">0</td>
                  </tr>
                  <tr className="bg-slate-50/40 hover:bg-slate-50 transition-colors duration-150">
                    <td className="py-1.5 px-2 text-left sticky left-0 bg-[#fbfdff] border-r border-gray-200 z-10">
                      <span className="text-blue-700 text-[8.5px] font-black uppercase tracking-wider pl-1">RV Taxes</span>
                    </td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">33,480</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">6,480</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">1,080</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">2,160</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">6,480</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">1,080</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">10,800</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">18,360</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">15,120</td>
                    <td className="py-1.5 px-2 font-bold text-slate-800 tabular-nums">3,240</td>
                  </tr>
                  <tr className="bg-purple-50/20 hover:bg-purple-50/40 transition-colors duration-150 font-bold">
                    <td className="py-1.5 px-2 text-left sticky left-0 bg-[#fcfbfe] border-r border-gray-200 z-10">
                      <span className="text-purple-700 text-[8.5px] font-black uppercase tracking-wider pl-1">CV Taxes</span>
                    </td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">1,53,47,12,291</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">41,80,17,898</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">34,83,48,248</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 font-bold text-slate-800 tabular-nums">34,83,48,248</td>
                    <td className="py-1.5 px-2 font-bold text-slate-800 tabular-nums">27,86,78,598</td>
                  </tr>
                  <tr className="bg-white hover:bg-slate-50 transition-colors duration-150">
                    <td className="py-1.5 px-2 text-left sticky left-0 bg-[#fffdfd] border-r border-gray-200 z-10">
                      <span className="text-red-600 text-[8.5px] font-black uppercase tracking-wider pl-1">Retain U.S. 129</span>
                    </td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 border-r border-gray-200 text-slate-800 font-bold">0</td>
                    <td className="py-1.5 px-2 text-slate-800 font-bold">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'assessment-comparison' ? (
        <div className="w-full flex flex-col bg-white p-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 select-none">
            <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase tracking-wider">Assessment Method Variance (RV vs CVM)</h3>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">Dual Valuation Audits</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[10.5px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 font-black uppercase tracking-wider h-[32px]">
                  <th className="py-2 px-3">Valuation Mode</th>
                  <th className="py-2 px-3">Rate Multiplier</th>
                  <th className="py-2 px-3 text-right">Avg Rate per SqM</th>
                  <th className="py-2 px-3 text-right">Assessed Base Value</th>
                  <th className="py-2 px-3 text-right">Gross Tax Levy</th>
                  <th className="py-2 px-3 text-right">Net Consolidated Tax</th>
                  <th className="py-2 px-3">Audit Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-slate-700 font-semibold">
                <tr className="h-[36px]">
                  <td className="py-1.5 px-3 font-black text-slate-800">Rateable Value (RV) Method</td>
                  <td className="py-1.5 px-3">0.12x Annual Rent</td>
                  <td className="py-1.5 px-3 text-right">₹320 / sq.ft.</td>
                  <td className="py-1.5 px-3 text-right">₹3,45,000</td>
                  <td className="py-1.5 px-3 text-right font-black">₹41,400</td>
                  <td className="py-1.5 px-3 text-right text-blue-700 font-bold">₹48,240</td>
                  <td className="py-1.5 px-3 text-green-600">Standard Approved Valuation</td>
                </tr>
                <tr className="h-[36px] bg-slate-50/30">
                  <td className="py-1.5 px-3 font-black text-slate-800">Capital Value Method (CVM)</td>
                  <td className="py-1.5 px-3">0.5% Ready Reckoner</td>
                  <td className="py-1.5 px-3 text-right">₹7,200 / sq.ft.</td>
                  <td className="py-1.5 px-3 text-right">₹48,20,000</td>
                  <td className="py-1.5 px-3 text-right font-black">₹24,100</td>
                  <td className="py-1.5 px-3 text-right text-blue-700 font-bold">₹31,450</td>
                  <td className="py-1.5 px-3 text-[#3b82f6]">Alternative Policy Valuation</td>
                </tr>
                <tr className="h-[38px] bg-amber-50/40 font-bold text-[#8a6d1c] border-t border-amber-200">
                  <td className="py-2 px-3">Difference / Variance</td>
                  <td className="py-2 px-3">—</td>
                  <td className="py-2 px-3 text-right">—</td>
                  <td className="py-2 px-3 text-right">-₹44,75,000</td>
                  <td className="py-2 px-3 text-right text-red-500 font-black">+₹17,300</td>
                  <td className="py-2 px-3 text-right text-red-500 font-black">+₹16,790</td>
                  <td className="py-2 px-3 text-[9px] text-[#8a6d1c] font-black">RV Method generates +34% higher tax</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'society-details' ? (
        <div className="w-full flex flex-col bg-white p-4 font-sans text-gray-800">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 select-none">
            <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase tracking-wider">Society Registration & Regulatory Details</h3>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">Registered Co-op Housing Society</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10.5px]">
            <div className="bg-slate-50 rounded-lg p-3 border border-gray-200 space-y-2">
              <span className="text-gray-500 font-black uppercase text-[9px] tracking-wider block">Cooperative Society Registry Info</span>
              <div><strong className="text-slate-800">Society Name:</strong> Royal Palms CHS Ltd.</div>
              <div><strong className="text-slate-800">Registration Number:</strong> MUM/CHS/4429/2021</div>
              <div><strong className="text-slate-800">RERA Registration:</strong> P51800029310</div>
              <div><strong className="text-slate-800">Total Tax Assessment ID:</strong> BLDG-ROYAL-PALMS-992</div>
              <div><strong className="text-slate-800">Audit Status:</strong> Compliant (Last audited May 2025)</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border border-gray-200 space-y-2">
              <span className="text-gray-500 font-black uppercase text-[9px] tracking-wider block">Executive Committee Contacts</span>
              <div><strong className="text-slate-800">Chairman:</strong> Mr. Prakash R. Deshmukh (+91 98201 22390)</div>
              <div><strong className="text-slate-800">Secretary:</strong> Mrs. Ananya Sen (+91 99304 88102)</div>
              <div><strong className="text-slate-800">Treasurer:</strong> Mr. Rajesh Nair (+91 98112 04958)</div>
              <div><strong className="text-slate-800">Office Address:</strong> Ground Floor, A Wing Clubhouse Lobby</div>
              <div><strong className="text-slate-800">Email Contact:</strong> royalpalms.chs@outlook.com</div>
            </div>
          </div>
        </div>
      ) : activeTab === 'documents' ? (
        <div className="w-full flex flex-col bg-white p-4 font-sans text-gray-800">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 select-none">
            <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase tracking-wider">Building & Flat Document Repository</h3>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">12 Active Files</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[10px]">
            <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-xs transition p-2.5 rounded-lg flex flex-col justify-between cursor-pointer">
              <div>
                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold">APPROVED PLAN</span>
                <span className="font-black text-[#1e2b58] block mt-1.5">Typical Floor Plan Layout (PDF)</span>
                <span className="text-gray-400 text-[8.5px] block mt-0.5">Size: 4.8 MB | Updated: 12-Jan-2026</span>
              </div>
              <button className="text-[9px] font-black text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 py-1 rounded text-center uppercase tracking-wider mt-2.5">Download Plan</button>
            </div>
            <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-xs transition p-2.5 rounded-lg flex flex-col justify-between cursor-pointer">
              <div>
                <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold">CERTIFICATE</span>
                <span className="font-black text-[#1e2b58] block mt-1.5">Occupancy Certificate (OC) (A & C)</span>
                <span className="text-gray-400 text-[8.5px] block mt-0.5">Size: 1.2 MB | Updated: 05-Feb-2026</span>
              </div>
              <button className="text-[9px] font-black text-green-600 bg-green-50/50 hover:bg-green-100/50 py-1 rounded text-center uppercase tracking-wider mt-2.5">Download OC</button>
            </div>
            <div className="bg-white border border-gray-200 hover:border-blue-500 hover:shadow-xs transition p-2.5 rounded-lg flex flex-col justify-between cursor-pointer">
              <div>
                <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold">GIS MAP</span>
                <span className="font-black text-[#1e2b58] block mt-1.5">GIS Overlay Cadastral Survey Map</span>
                <span className="text-gray-400 text-[8.5px] block mt-0.5">Size: 8.5 MB | Updated: 20-Feb-2026</span>
              </div>
              <button className="text-[9px] font-black text-purple-600 bg-purple-50/50 hover:bg-purple-100/50 py-1 rounded text-center uppercase tracking-wider mt-2.5">Download Map</button>
            </div>
          </div>
        </div>
      ) : activeTab === 'discount-exemption' ? (
        <div className="w-full flex flex-col bg-white p-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 select-none">
            <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase tracking-wider">Active Concessions, Exemptions & Discounts</h3>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">Policy Act Sec 130</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[10.5px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 font-black uppercase tracking-wider h-[32px]">
                  <th className="py-2 px-3">Unit Number</th>
                  <th className="py-2 px-3">Owner Name</th>
                  <th className="py-2 px-3">Exemption Category</th>
                  <th className="py-2 px-3 text-center">Concession (%)</th>
                  <th className="py-2 px-3 text-right">Tax Exemption Amount</th>
                  <th className="py-2 px-3">Justification Docket No.</th>
                  <th className="py-2 px-3 text-center">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-slate-700 font-semibold">
                <tr className="h-[36px]">
                  <td className="py-1.5 px-3 font-bold text-slate-800">A-102</td>
                  <td className="py-1.5 px-3">Sunita Sharma</td>
                  <td className="py-1.5 px-3">Senior Citizen (Self-occupied)</td>
                  <td className="py-1.5 px-3 text-center text-blue-600 font-bold">15% Concession</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹5,391</td>
                  <td className="py-1.5 px-3">DOC-SENIOR-102A</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200">VERIFIED</span></td>
                </tr>
                <tr className="h-[36px] bg-slate-50/30">
                  <td className="py-1.5 px-3 font-bold text-slate-800">A-105</td>
                  <td className="py-1.5 px-3">Exempt Unit 500sqft</td>
                  <td className="py-1.5 px-3">Area under 500 sq.ft. (TMC Act)</td>
                  <td className="py-1.5 px-3 text-center text-blue-600 font-bold">100% Exempted</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹12,450</td>
                  <td className="py-1.5 px-3">TMC-EXEMPT-RULE-3A</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200">VERIFIED</span></td>
                </tr>
                <tr className="h-[36px]">
                  <td className="py-1.5 px-3 font-bold text-slate-800">C-104</td>
                  <td className="py-1.5 px-3">Aniket Sawant</td>
                  <td className="py-1.5 px-3">Freedom Fighter Family</td>
                  <td className="py-1.5 px-3 text-center text-blue-600 font-bold">50% Concession</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹5,820</td>
                  <td className="py-1.5 px-3">DOC-FF-REV-849</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200">VERIFIED</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'reports' ? (
        <div className="w-full flex flex-col bg-white p-4 font-sans text-gray-800">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 select-none">
            <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase tracking-wider">Assessment Notices & Reports Generator</h3>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">PDF Generator Engine</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10.5px]">
            <div className="bg-slate-50 border border-gray-200 p-3 rounded-lg flex flex-col justify-between">
              <div>
                <span className="font-black text-slate-800 text-[11px] block">Standard Section 129 Notice of Assessment</span>
                <p className="text-gray-550 font-medium mt-1 leading-normal">Generate the formal TMC Section 129 notice proposing the rateable value adjustments and the revised headwise cess obligations for review.</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/50">
                <span className="text-[8.5px] text-gray-400 font-bold">Template: TMC-129-N_V2</span>
                <button className="bg-blue-600 text-white font-extrabold px-3 py-1 rounded text-[9.5px] cursor-pointer hover:bg-blue-700 transition">Print Notice</button>
              </div>
            </div>
            <div className="bg-slate-50 border border-gray-200 p-3 rounded-lg flex flex-col justify-between">
              <div>
                <span className="font-black text-slate-800 text-[11px] block">Retrospective Audit & Penalty Report</span>
                <p className="text-gray-555 font-medium mt-1 leading-normal">Generate the comprehensive penalty and simple interest breakdown report under Section 129A for the three-year retrospective period.</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/50">
                <span className="text-[8.5px] text-gray-400 font-bold">Template: RETRO-AUDIT-R_V1</span>
                <button className="bg-[#10b981] text-white font-extrabold px-3 py-1 rounded text-[9.5px] cursor-pointer hover:bg-[#059669] transition">Print Report</button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'old-details' ? (
        <div className="w-full flex flex-col bg-white p-4 font-sans text-gray-800">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3 select-none">
            <h3 className="font-extrabold text-[#1e2b58] text-[12px] uppercase tracking-wider">Historical Assessment Ledgers & Payment Registry</h3>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full font-bold">GIS Historical Sync</span>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[10.5px]">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 font-black uppercase tracking-wider h-[32px]">
                  <th className="py-2 px-3">Tax Cycle</th>
                  <th className="py-2 px-3 text-right">Prior RV</th>
                  <th className="py-2 px-3 text-right">Prior CV</th>
                  <th className="py-2 px-3 text-right">Taxes Paid</th>
                  <th className="py-2 px-3 text-right">Penalties Paid</th>
                  <th className="py-2 px-3 text-center">Receipt Number</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-slate-700 font-semibold">
                <tr className="h-[36px]">
                  <td className="py-1.5 px-3 font-bold text-slate-800">FY 2023-2024</td>
                  <td className="py-1.5 px-3 text-right font-black text-blue-600">₹16,20,000</td>
                  <td className="py-1.5 px-3 text-right">₹2,02,50,000</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹16,500</td>
                  <td className="py-1.5 px-3 text-right">₹0</td>
                  <td className="py-1.5 px-3 text-center text-gray-400">RCPT-2304910</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200">PAID & CLEAR</span></td>
                </tr>
                <tr className="h-[36px] bg-slate-50/30">
                  <td className="py-1.5 px-3 font-bold text-slate-800">FY 2022-2023</td>
                  <td className="py-1.5 px-3 text-right font-black text-blue-600">₹16,20,000</td>
                  <td className="py-1.5 px-3 text-right">₹2,02,50,000</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹16,500</td>
                  <td className="py-1.5 px-3 text-right">₹0</td>
                  <td className="py-1.5 px-3 text-center text-gray-400">RCPT-2201827</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200">PAID & CLEAR</span></td>
                </tr>
                <tr className="h-[36px]">
                  <td className="py-1.5 px-3 font-bold text-slate-800">FY 2021-2022</td>
                  <td className="py-1.5 px-3 text-right font-black text-blue-600">₹14,50,000</td>
                  <td className="py-1.5 px-3 text-right">₹1,81,25,000</td>
                  <td className="py-1.5 px-3 text-right text-green-600 font-bold">₹14,200</td>
                  <td className="py-1.5 px-3 text-right text-red-500 font-bold">₹1,420</td>
                  <td className="py-1.5 px-3 text-center text-gray-400">RCPT-2100845</td>
                  <td className="py-1.5 px-3 text-center"><span className="text-[8.5px] bg-green-50 text-green-700 font-bold px-1.5 py-0.5 rounded border border-green-200">PAID & CLEAR</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="w-full flex overflow-hidden relative" style={{ minHeight: 0 }}>
          {/* LEFT TABLE: Existing Assessment (Previous) */}
          <div className="flex flex-col bg-[#f5f8fc] overflow-hidden" style={{ width: `${panelWidths.left}%` }}>
            <div className="bg-[#edf7f4] border-b border-gray-200 px-3 py-1.5 flex items-center justify-center h-[34px] shrink-0 relative">
              <div className="flex items-center gap-1 select-none justify-center">
                <span className="text-[10px] font-black text-[#006a4e] uppercase tracking-tight">Existing Assessment</span>
                <span className="text-[9.5px] text-[#006a4e]/75 font-semibold">(Previous)</span>
              </div>
              <span className="text-[8px] font-bold text-gray-400 select-none tabular-nums absolute right-3 top-1/2 -translate-y-1/2">{Math.round(panelWidths.left)}%</span>
            </div>
            
            <PreviousAssessmentTable 
              rows={rows} 
              onOpenRules={setSelectedRowForRules} 
              getStatusBgClass={getStatusBgClass} 
              getStatusBadgeClass={getStatusBadgeClass} 
              scrollContainerRef={leftTableRef}
              isAllWingsSelected={selectedWing === "All Wings"}
            />
          </div>

          {/* LEFT DIVIDER HANDLE */}
          <div
            className="shrink-0 w-[7px] flex flex-col items-center justify-center bg-gray-100 border-x border-gray-200 cursor-col-resize hover:bg-blue-100 active:bg-blue-200 transition-colors group select-none z-10"
            onMouseDown={(e) => handleMouseDown('left', e)}
            onDoubleClick={resetPanelWidths}
            title="Drag to resize · Double-click to reset"
          >
            <GripVertical size={10} className="text-gray-400 group-hover:text-blue-500 group-active:text-blue-600 transition-colors" />
          </div>

          {/* MIDDLE COLUMN: Difference Engine */}
          <div className="flex flex-col bg-[#f5f8fc] overflow-hidden" style={{ width: `${panelWidths.middle}%` }}>
            <div className="bg-[#fdf8e2] border-b border-amber-250/60 px-3 py-1.5 flex items-center justify-center h-[34px] shrink-0 relative">
              <span className="text-[10px] font-black text-[#8a6d1c] uppercase tracking-tight text-center">Difference Engine</span>
              <div className="flex items-center gap-1.5 absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-[8px] font-bold text-gray-400 select-none tabular-nums">{Math.round(panelWidths.middle)}%</span>
                <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
                  AI Status
                </button>
              </div>
            </div>
            
            <div 
              ref={middleTableRef} 
              className={`w-full scrollbar-thin ${selectedWing === "All Wings" ? "overflow-auto h-[400px]" : "overflow-x-auto"}`}
            >
              <table className="min-w-[280px] text-left border-collapse text-[10px] w-full">
                <thead>
                  <tr className="bg-[#fdf8e2]/60 border-b border-amber-200 text-[#8a6d1c] font-black uppercase h-[32px] align-middle">
                    <th className="px-1.5 text-right align-middle whitespace-nowrap">Carpet Δ</th>
                    <th className="px-1.5 text-right align-middle whitespace-nowrap">BUA Δ</th>
                    <th className="px-1.5 text-right align-middle whitespace-nowrap">RV Δ (₹)</th>
                    <th className="px-1.5 text-right align-middle whitespace-nowrap">Tax Δ (₹)</th>
                    <th className="px-1.5 text-right align-middle whitespace-nowrap">Rt Tax Δ</th>
                    <th className="px-1.5 text-right align-middle whitespace-nowrap">Pen Δ</th>
                    <th className="px-1.5 text-center align-middle whitespace-nowrap">Suggestion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {rows.map((row, index) => {
                    return (
                      <tr key={index} className={`h-[36px] font-bold hover:bg-gray-50/50 ${getStatusBgClass(row.diffStatus)}`}>
                        <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffCarpet > 0 ? 'text-[#dc2626] font-black' : 'text-slate-500 font-semibold'}`}>
                          {row.diffCarpet > 0 ? `+${row.diffCarpet}` : '0'}
                        </td>
                        <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffBua > 0 ? 'text-[#dc2626] font-black' : 'text-slate-500 font-semibold'}`}>
                          {row.diffBua > 0 ? `+${row.diffBua}` : '0'}
                        </td>
                        <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffRv > 0 ? 'text-[#dc2626] font-black' : 'text-slate-500 font-semibold'}`}>
                          {row.diffRv > 0 ? `+${row.diffRv.toLocaleString()}` : '0'}
                        </td>
                        <td className={`py-1 px-1.5 text-right whitespace-nowrap ${row.diffTax > 0 ? 'text-[#dc2626] font-black' : 'text-slate-500 font-semibold'}`}>
                          {row.diffTax > 0 ? `+${row.diffTax.toLocaleString()}` : '0'}
                        </td>
                        <td className="py-1 px-1.5 text-right text-slate-500 font-semibold whitespace-nowrap">0</td>
                        <td className="py-1 px-1.5 text-right text-slate-500 font-semibold whitespace-nowrap">0</td>
                        <td className="py-1 px-1 text-center whitespace-nowrap select-none">
                          {row.diffSuggestion !== "-" ? (
                            <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border leading-none ${
                              row.diffSuggestion === 'Verify Area' ? 'bg-green-50 text-green-600 border-green-200' :
                              row.diffSuggestion === 'Create New' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                              'bg-amber-50 text-amber-600 border-amber-200'
                            }`}>
                              {row.diffSuggestion}
                            </span>
                          ) : "-"}
                        </td>
                      </tr>
                    );
                  })}
                  
                  <tr className="h-[32px] bg-[#fdf8e2]/60 font-black border-t border-amber-200 text-[#8a6d1c]">
                    <td className="py-2 px-1.5 text-right whitespace-nowrap text-[#dc2626] font-black">+124</td>
                    <td className="py-2 px-1.5 text-right whitespace-nowrap text-[#dc2626] font-black">+200</td>
                    <td className="py-2 px-1.5 text-right whitespace-nowrap text-[#dc2626] font-black">+2,917</td>
                    <td className="py-2 px-1.5 text-right whitespace-nowrap text-[#dc2626] font-black">+11,680</td>
                    <td className="py-2 px-1.5 text-right text-slate-500 font-black whitespace-nowrap">0</td>
                    <td className="py-2 px-1.5 text-right text-slate-500 font-black whitespace-nowrap">0</td>
                    <td className="whitespace-nowrap"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT DIVIDER HANDLE */}
          <div
            className="shrink-0 w-[7px] flex flex-col items-center justify-center bg-gray-100 border-x border-gray-200 cursor-col-resize hover:bg-blue-100 active:bg-blue-200 transition-colors group select-none z-10"
            onMouseDown={(e) => handleMouseDown('right', e)}
            onDoubleClick={resetPanelWidths}
            title="Drag to resize · Double-click to reset"
          >
            <GripVertical size={10} className="text-gray-400 group-hover:text-blue-500 group-active:text-blue-600 transition-colors" />
          </div>

          {/* RIGHT TABLE: New Survey (Current) */}
          <div className="flex flex-col bg-[#f5f8fc] overflow-hidden" style={{ width: `${panelWidths.right}%` }}>
            <div className="bg-[#edf2ff] border-b border-gray-200 px-3 py-1.5 flex items-center justify-center h-[34px] shrink-0 relative">
              <div className="flex items-center gap-1 select-none justify-center">
                <span className="text-[10px] font-black text-[#1e40af] uppercase tracking-tight">New Survey</span>
                <span className="text-[9.5px] text-[#1e40af]/75 font-semibold">(Current)</span>
              </div>
              <span className="text-[8px] font-bold text-gray-400 select-none tabular-nums absolute right-3 top-1/2 -translate-y-1/2">{Math.round(panelWidths.right)}%</span>
            </div>
            
            <CurrentSurveyTable 
              rows={rows} 
              onOpenRules={setSelectedRowForRules} 
              getStatusBgClass={getStatusBgClass} 
              getStatusBadgeClass={getStatusBadgeClass} 
              scrollContainerRef={rightTableRef}
              isAllWingsSelected={selectedWing === "All Wings"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
