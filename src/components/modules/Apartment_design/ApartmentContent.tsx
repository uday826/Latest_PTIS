"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Droplet, 
  ShieldCheck, 
  Briefcase, 
  Link2, 
  UserCheck, 
  Wallet, 
  Plus, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  SlidersHorizontal,
  FileSpreadsheet,
  Check,
  Star,
  Layers,
  Image as ImageIcon,
  FileText,
  Percent,
  TrendingUp,
  Home,
  Ruler,
  Camera,
  Maximize2,
  Trash2,
  ChevronUp
} from 'lucide-react';

export default function ApartmentContent({
  activeAction,
  setActiveAction
}: {
  activeAction?: string | null;
  setActiveAction?: (action: string | null) => void;
}) {
  const [activeTab, setActiveTab] = useState('floor-comparison');
  const [selectedWing, setSelectedWing] = useState('B Wing (19)');
  const [selectedFloor, setSelectedFloor] = useState('All Floors');
  const [copiedUpic, setCopiedUpic] = useState(false);

  // States for right column media preview & hover zoom
  const [hoveredImg, setHoveredImg] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<'left' | 'right'>('left');
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [selectedImgTitle, setSelectedImgTitle] = useState<string | null>(null);

  // Wing state array and interactive metric states
  const [wings, setWings] = useState([
    {
      id: 'A',
      grade: 'A+',
      wing: 'A Wing',
      name: 'Krishna Block',
      floors: 'G + 7',
      units: '19',
      res: '16',
      com: '2',
      amen: '1',
      newDem: '43,920',
      retroDem: '68,850',
      discount: '-₹5,391',
      discLabel: '7u',
      exemp: '2 u',
      exempLabel: '<500 sq.ft.',
      rvImpact: '+₹1.23L',
      rvLabel: '+253.9%',
      themeColor: 'green',
      gradeBorderColor: 'border-green-500 text-green-600',
      badgeBgColor: 'bg-green-700',
      discountDetails: {
        amount: '₹5,391',
        pct: '12.27%',
        units: '7 Units',
        category: 'Senior Citizen & Small Area',
        period: 'FY 2023-24',
        status: 'Approved',
        remarks: 'Applicable to residential units under 500 sq.ft.'
      },
      exemptionDetails: {
        units: '2 Units',
        category: 'Freedom Fighter & Defense Exemption',
        eligible: 'Flat 102, Flat 204',
        amount: '₹4,500',
        certNo: 'CERT-FF-9921',
        validity: 'Permanent',
        status: 'Verified',
        remarks: 'General tax component fully exempted.'
      },
      rvImpactDetails: {
        prevRv: '₹12,450',
        revisedRv: '₹43,920',
        diff: '₹31,470',
        pctChange: '+253.9%',
        units: '19 Units',
        effectiveDate: '01-Apr-2023',
        ref: 'TMC-RV-2023-A',
        remarks: 'Revised based on carpet area physical survey.'
      }
    },
    {
      id: 'B',
      grade: 'A',
      wing: 'B Wing',
      name: 'Sai Block',
      floors: 'G + 7',
      units: '19',
      res: '16',
      com: '2',
      amen: '1',
      newDem: '43,920',
      retroDem: '68,560',
      discount: '-₹5,391',
      discLabel: '7u',
      exemp: '2 u',
      exempLabel: '<500 sq.ft.',
      rvImpact: '+₹1.23L',
      rvLabel: '+253.9%',
      themeColor: 'purple',
      gradeBorderColor: 'border-purple-500 text-purple-600',
      badgeBgColor: 'bg-purple-750',
      discountDetails: {
        amount: '₹5,391',
        pct: '12.27%',
        units: '7 Units',
        category: 'Senior Citizen & Small Area',
        period: 'FY 2023-24',
        status: 'Approved',
        remarks: 'Applicable to residential units under 500 sq.ft.'
      },
      exemptionDetails: {
        units: '2 Units',
        category: 'Freedom Fighter & Defense Exemption',
        eligible: 'Flat 103, Flat 205',
        amount: '₹4,500',
        certNo: 'CERT-FF-9922',
        validity: 'Permanent',
        status: 'Verified',
        remarks: 'General tax component fully exempted.'
      },
      rvImpactDetails: {
        prevRv: '₹12,450',
        revisedRv: '₹43,920',
        diff: '₹31,470',
        pctChange: '+253.9%',
        units: '19 Units',
        effectiveDate: '01-Apr-2023',
        ref: 'TMC-RV-2023-B',
        remarks: 'Revised based on carpet area physical survey.'
      }
    },
    {
      id: 'C',
      grade: 'A+',
      wing: 'C Wing',
      name: 'Ganesh Block',
      floors: 'G + 7',
      units: '15',
      res: '12',
      com: '2',
      amen: '1',
      newDem: '43,920',
      retroDem: '50,160',
      discount: '-₹5,820',
      discLabel: '5u',
      exemp: '1 u',
      exempLabel: 'Freedom Fighter',
      rvImpact: '+₹86,240',
      rvLabel: '+206.7%',
      themeColor: 'green',
      gradeBorderColor: 'border-green-500 text-green-600',
      badgeBgColor: 'bg-green-700',
      discountDetails: {
        amount: '₹5,820',
        pct: '11.60%',
        units: '5 Units',
        category: 'Senior Citizen & Small Area',
        period: 'FY 2023-24',
        status: 'Approved',
        remarks: 'Applicable to residential units under 500 sq.ft.'
      },
      exemptionDetails: {
        units: '1 Unit',
        category: 'Freedom Fighter & Defense Exemption',
        eligible: 'Flat 302',
        amount: '₹2,250',
        certNo: 'CERT-FF-9923',
        validity: 'Permanent',
        status: 'Verified',
        remarks: 'General tax component fully exempted.'
      },
      rvImpactDetails: {
        prevRv: '₹41,720',
        revisedRv: '₹1,27,960',
        diff: '₹86,240',
        pctChange: '+206.7%',
        units: '15 Units',
        effectiveDate: '01-Apr-2023',
        ref: 'TMC-RV-2023-C',
        remarks: 'Revised based on carpet area physical survey.'
      }
    },
    {
      id: 'D',
      grade: 'B+',
      wing: 'D Wing',
      name: 'Lotus Block',
      floors: 'G + 6',
      units: '14',
      res: '11',
      com: '2',
      amen: '1',
      newDem: '40,220',
      retroDem: '48,440',
      discount: '-₹4,120',
      discLabel: '3u',
      exemp: '0 u',
      exempLabel: '-',
      rvImpact: '+₹62,310',
      rvLabel: '+178.9%',
      themeColor: 'orange',
      gradeBorderColor: 'border-orange-500 text-orange-600',
      badgeBgColor: 'bg-orange-600',
      discountDetails: {
        amount: '₹4,120',
        pct: '8.51%',
        units: '3 Units',
        category: 'Senior Citizen & Small Area',
        period: 'FY 2023-24',
        status: 'Approved',
        remarks: 'Applicable to residential units under 500 sq.ft.'
      },
      exemptionDetails: {
        units: '0 Units',
        category: 'None',
        eligible: '-',
        amount: '₹0',
        certNo: '-',
        validity: '-',
        status: 'Verified',
        remarks: 'No active exemptions found.'
      },
      rvImpactDetails: {
        prevRv: '₹34,830',
        revisedRv: '₹97,140',
        diff: '₹62,310',
        pctChange: '+178.9%',
        units: '14 Units',
        effectiveDate: '01-Apr-2023',
        ref: 'TMC-RV-2023-D',
        remarks: 'Revised based on carpet area physical survey.'
      }
    }
  ]);
  const [activeMetrics, setActiveMetrics] = useState<Record<string, 'discount' | 'exemptions' | 'rvImpact'>>({
    A: 'discount',
    B: 'discount',
    C: 'discount',
    D: 'discount'
  });
  const [popupData, setPopupData] = useState<any | null>(null);
  const [addWingModalOpen, setAddWingModalOpen] = useState(false);
  const summaryRef = React.useRef<HTMLDivElement>(null);

  // Form states for Add New Wing
  const [formValues, setFormValues] = useState({
    wingName: '',
    blockName: '',
    grade: 'A+',
    themeColor: 'blue',
    floors: '7',
    units: '15',
    res: '12',
    com: '2',
    amen: '1',
    newDem: '43,920',
    retroDem: '50,000',
    discount: '-₹5,000',
    discLabel: '5u',
    exemp: '1 u',
    exempLabel: 'Freedom Fighter',
    rvImpact: '+₹85,000',
    rvLabel: '+200.0%'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formValues.wingName.trim()) {
      errors.wingName = 'Wing Name is required';
    } else if (wings.some(w => w.wing.toLowerCase() === formValues.wingName.trim().toLowerCase())) {
      errors.wingName = 'Wing Name must be unique';
    }
    
    const floorsNum = Number(formValues.floors);
    if (isNaN(floorsNum) || floorsNum < 0) {
      errors.floors = 'Floors cannot be negative';
    }
    
    const unitsNum = Number(formValues.units);
    if (isNaN(unitsNum) || unitsNum < 0) {
      errors.units = 'Total Units cannot be negative';
    }
    
    const resNum = Number(formValues.res);
    const comNum = Number(formValues.com);
    const amenNum = Number(formValues.amen);
    if (isNaN(resNum) || resNum < 0) errors.res = 'Cannot be negative';
    if (isNaN(comNum) || comNum < 0) errors.com = 'Cannot be negative';
    if (isNaN(amenNum) || amenNum < 0) errors.amen = 'Cannot be negative';
    
    if (!errors.units && !errors.res && !errors.com && !errors.amen) {
      if (resNum + comNum + amenNum > unitsNum) {
        errors.units = 'Res + Com + Amen units cannot exceed Total Units';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddWingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      const themeConfig = {
        green: {
          themeColor: 'green',
          gradeBorderColor: 'border-green-500 text-green-600',
          badgeBgColor: 'bg-green-700'
        },
        purple: {
          themeColor: 'purple',
          gradeBorderColor: 'border-purple-500 text-purple-600',
          badgeBgColor: 'bg-purple-750'
        },
        orange: {
          themeColor: 'orange',
          gradeBorderColor: 'border-orange-500 text-orange-600',
          badgeBgColor: 'bg-orange-600'
        },
        blue: {
          themeColor: 'blue',
          gradeBorderColor: 'border-blue-500 text-blue-600',
          badgeBgColor: 'bg-blue-700'
        }
      }[formValues.themeColor as 'green' | 'purple' | 'orange' | 'blue'] || {
        themeColor: 'blue',
        gradeBorderColor: 'border-blue-500 text-blue-600',
        badgeBgColor: 'bg-blue-700'
      };

      const newWingObj = {
        id: formValues.wingName.trim().charAt(0).toUpperCase(),
        grade: formValues.grade,
        wing: formValues.wingName.trim(),
        name: formValues.blockName.trim() || 'Block',
        floors: `G + ${Number(formValues.floors) - 1 || 1}`,
        units: formValues.units,
        res: formValues.res,
        com: formValues.com,
        amen: formValues.amen,
        newDem: formValues.newDem,
        retroDem: formValues.retroDem,
        discount: formValues.discount,
        discLabel: formValues.discLabel,
        exemp: formValues.exemp,
        exempLabel: formValues.exempLabel,
        rvImpact: formValues.rvImpact,
        rvLabel: formValues.rvLabel,
        ...themeConfig,
        discountDetails: {
          amount: formValues.discount,
          pct: '10%',
          units: `${formValues.discLabel} Units`,
          category: 'Standard Discount Policy',
          period: 'FY 2023-24',
          status: 'Approved',
          remarks: 'System generated discount based on rules.'
        },
        exemptionDetails: {
          units: `${formValues.exemp} Units`,
          category: 'Social Exemption Status',
          eligible: 'Specified units only',
          amount: '₹3,000',
          certNo: 'CERT-EX-2023',
          validity: 'Valid',
          status: 'Approved',
          remarks: formValues.exempLabel || 'Exemption details matching certificate.'
        },
        rvImpactDetails: {
          prevRv: '₹15,000',
          revisedRv: formValues.newDem,
          diff: formValues.rvImpact,
          pctChange: formValues.rvLabel,
          units: `${formValues.units} Units`,
          effectiveDate: '01-Apr-2023',
          ref: 'TMC-RV-2023',
          remarks: 'Dynamic calculated difference engine impact.'
        }
      };

      setWings(prev => [...prev, newWingObj]);
      setActiveMetrics(prev => ({
        ...prev,
        [newWingObj.id]: 'discount'
      }));
      
      setFormValues({
        wingName: '',
        blockName: '',
        grade: 'A+',
        themeColor: 'blue',
        floors: '7',
        units: '15',
        res: '12',
        com: '2',
        amen: '1',
        newDem: '43,920',
        retroDem: '50,000',
        discount: '-₹5,000',
        discLabel: '5u',
        exemp: '1 u',
        exempLabel: 'Freedom Fighter',
        rvImpact: '+₹85,000',
        rvLabel: '+200.0%'
      });
      setFormErrors({});
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setAddWingModalOpen(false);
      }, 1500);
    }, 1000);
  };

  const handleMetricClick = (e: React.MouseEvent<HTMLButtonElement>, wing: any, metricType: 'discount' | 'exemptions' | 'rvImpact') => {
    e.stopPropagation();
    
    setActiveMetrics(prev => ({
      ...prev,
      [wing.id]: metricType
    }));

    if (!summaryRef.current) return;
    const containerRect = summaryRef.current.getBoundingClientRect();
    const targetRect = e.currentTarget.getBoundingClientRect();
    
    const popoverWidth = 285;
    const top = targetRect.bottom - containerRect.top + 6;
    let left = targetRect.left - containerRect.left - (popoverWidth - targetRect.width) / 2;
    left = Math.max(10, Math.min(left, containerRect.width - popoverWidth - 10));

    setPopupData({
      top,
      left,
      wing,
      type: metricType
    });
  };

  const handleDeleteWing = (e: React.MouseEvent, wingId: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${wingId} Wing?`)) {
      setWings(prev => prev.filter(w => w.id !== wingId));
      setActiveMetrics(prev => {
        const next = { ...prev };
        delete next[wingId];
        return next;
      });
      if (popupData && popupData.wing.id === wingId) {
        setPopupData(null);
      }
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImg(null);
        setPopupData(null);
        setAddWingModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHoverImage = (url: string | null, position: 'left' | 'right' = 'left') => {
    setHoveredImg(url);
    if (url) {
      setHoverPosition(position);
    }
  };

  const handleCopyUpic = () => {
    navigator.clipboard.writeText("UPIC-270465-APT-000567");
    setCopiedUpic(true);
    setTimeout(() => setCopiedUpic(false), 2000);
  };


  // Mock Table Data for Side-by-Side Comparison
  const comparisonRows = [
    {
      id: 1,
      prevProp: "102",
      prevWing: "B/102",
      prevType: "Flat",
      prevFlr: "1",
      prevYr: "2008",
      prevCon: "RCC",
      prevUse: "Residential",
      prevRent: "-",
      prevCarpet: 624,
      prevBua: 780,
      prevAyr: "2024-25",
      prevRtPd: "2021-24",
      prevRate: "8.00",
      prevRv: "3,510",
      prevTax: "10,811",
      prevPen: 0,
      prevPenT: 0,
      // Diff
      diffCarpet: 0,
      diffBua: 0,
      diffRv: 0,
      diffTax: 0,
      diffStatus: "Matched",
      diffSuggestion: "-",
      // Current
      currProp: "102",
      currWing: "B/102",
      currType: "Flat",
      currFlr: "1",
      currYr: "2008",
      currCon: "RCC",
      currUse: "Residential",
      currRent: "-",
      currCarpet: 624,
      currBua: 780,
      currAyr: "2024-25",
      currRtPd: "2021-24",
      currRate: "8.00",
      currRv: "3,510",
      currTax: "10,811",
    },
    {
      id: 2,
      prevProp: "103",
      prevWing: "B/103",
      prevType: "Flat",
      prevFlr: "1",
      prevYr: "2010",
      prevCon: "RCC",
      prevUse: "Residential",
      prevRent: "-",
      prevCarpet: 736,
      prevBua: 920,
      prevAyr: "2024-25",
      prevRtPd: "2021-24",
      prevRate: "8.00",
      prevRv: "4,410",
      prevTax: "13,583",
      prevPen: 0,
      prevPenT: 0,
      // Diff
      diffCarpet: 48,
      diffBua: 60,
      diffRv: 767,
      diffTax: 2021,
      diffStatus: "Modified",
      diffSuggestion: "Verify Area",
      // Current
      currProp: "103",
      currWing: "B/103",
      currType: "Flat",
      currFlr: "1",
      currYr: "2010",
      currCon: "RCC",
      currUse: "Residential",
      currRent: "-",
      currCarpet: 784,
      currBua: 980,
      currAyr: "2024-25",
      currRtPd: "2021-24",
      currRate: "8.00",
      currRv: "5,177",
      currTax: "15,604",
    },
    {
      id: 3,
      prevProp: "201",
      prevWing: "B/201",
      prevType: "Flat",
      prevFlr: "2",
      prevYr: "2008",
      prevCon: "RCC",
      prevUse: "Residential",
      prevRent: "₹15,000",
      prevCarpet: 680,
      prevBua: 850,
      prevAyr: "2024-25",
      prevRtPd: "2021-24",
      prevRate: "10.00",
      prevRv: "3,825",
      prevTax: "11,781",
      prevPen: 3620,
      prevPenT: 0,
      // Diff
      diffCarpet: 0,
      diffBua: 0,
      diffRv: 0,
      diffTax: 0,
      diffStatus: "Matched",
      diffSuggestion: "-",
      // Current
      currProp: "201",
      currWing: "B/201",
      currType: "Flat",
      currFlr: "2",
      currYr: "2008",
      currCon: "RCC",
      currUse: "Residential",
      currRent: "₹15,000",
      currCarpet: 680,
      currBua: 850,
      currAyr: "2024-25",
      currRtPd: "2021-24",
      currRate: "10.00",
      currRv: "3,825",
      currTax: "11,781",
    },
    {
      id: 4,
      prevProp: "S-01",
      prevWing: "B/S-01",
      prevType: "Shop",
      prevFlr: "G",
      prevYr: "2015",
      prevCon: "RCC",
      prevUse: "Commercial",
      prevRent: "₹25,000",
      prevCarpet: 256,
      prevBua: 320,
      prevAyr: "2024-25",
      prevRtPd: "2021-24",
      prevRate: "10.00",
      prevRv: "3,456",
      prevTax: "12,255",
      prevPen: 2100,
      prevPenT: 500,
      // Diff
      diffCarpet: 0,
      diffBua: 0,
      diffRv: 0,
      diffTax: 0,
      diffStatus: "Matched",
      diffSuggestion: "-",
      // Current
      currProp: "S-01",
      currWing: "B/S-01",
      currType: "Shop",
      currFlr: "G",
      currYr: "2015",
      currCon: "RCC",
      currUse: "Commercial",
      currRent: "₹25,000",
      currCarpet: 256,
      currBua: 320,
      currAyr: "2024-25",
      currRtPd: "2021-24",
      currRate: "10.00",
      currRv: "3,456",
      currTax: "12,255",
    },
    {
      id: 5,
      prevProp: "S-02",
      prevWing: "B/S-02",
      prevType: "Shop",
      prevFlr: "G",
      prevYr: "2015",
      prevCon: "RCC",
      prevUse: "Commercial",
      prevRent: "₹18,000",
      prevCarpet: 224,
      prevBua: 280,
      prevAyr: "2024-25",
      prevRtPd: "2021-24",
      prevRate: "10.00",
      prevRv: "3,024",
      prevTax: "12,011",
      prevPen: 1000,
      prevPenT: 0,
      // Diff
      diffCarpet: 12,
      diffBua: 20,
      diffRv: 88,
      diffTax: 299,
      diffStatus: "Modified",
      diffSuggestion: "Verify Area",
      // Current
      currProp: "S-02",
      currWing: "B/S-02",
      currType: "Shop",
      currFlr: "G",
      currYr: "2015",
      currCon: "RCC",
      currUse: "Commercial",
      currRent: "₹25,000",
      currCarpet: 236,
      currBua: 300,
      currAyr: "2024-25",
      currRtPd: "2021-24",
      currRate: "10.00",
      currRv: "3,112",
      currTax: "12,310",
    },
    {
      id: 6,
      prevProp: "S-03",
      prevWing: "B/S-03",
      prevType: "Shop",
      prevFlr: "G",
      prevYr: "2015",
      prevCon: "RCC",
      prevUse: "Commercial",
      prevRent: "₹20,000",
      prevCarpet: 288,
      prevBua: 360,
      prevAyr: "2024-25",
      prevRtPd: "2021-24",
      prevRate: "10.00",
      prevRv: "2,836",
      prevTax: "10,839",
      prevPen: 0,
      prevPenT: 0,
      // Diff
      diffCarpet: 0,
      diffBua: 0,
      diffRv: 0,
      diffTax: 0,
      diffStatus: "Matched",
      diffSuggestion: "-",
      // Current
      currProp: "S-03",
      currWing: "B/S-03",
      currType: "Shop",
      currFlr: "G",
      currYr: "2015",
      currCon: "RCC",
      currUse: "Commercial",
      currRent: "₹20,000",
      currCarpet: 288,
      currBua: 360,
      currAyr: "2024-25",
      currRtPd: "2021-24",
      currRate: "10.00",
      currRv: "2,836",
      currTax: "10,839",
    },
    {
      id: 7,
      prevProp: "104",
      prevWing: "B/104",
      prevType: "Flat",
      prevFlr: "1",
      prevYr: "2008",
      prevCon: "RCC",
      prevUse: "Residential",
      prevRent: "-",
      prevCarpet: 0,
      prevBua: 0,
      prevAyr: "-",
      prevRtPd: "-",
      prevRate: "-",
      prevRv: "-",
      prevTax: "-",
      prevPen: 0,
      prevPenT: 0,
      // Diff
      diffCarpet: 32,
      diffBua: 60,
      diffRv: 1031,
      diffTax: 3620,
      diffStatus: "New",
      diffSuggestion: "Create New",
      // Current
      currProp: "104",
      currWing: "B/104",
      currType: "Flat",
      currFlr: "1",
      currYr: "2008",
      currCon: "RCC",
      currUse: "Residential",
      currRent: "-",
      currCarpet: 600,
      currBua: 800,
      currAyr: "2024-25",
      currRtPd: "2021-24",
      currRate: "8.00",
      currRv: "4,856",
      currTax: "14,401",
    },
    {
      id: 8,
      prevProp: "105",
      prevWing: "B/105",
      prevType: "Flat",
      prevFlr: "1",
      prevYr: "2008",
      prevCon: "RCC",
      prevUse: "Residential",
      prevRent: "-",
      prevCarpet: 0,
      prevBua: 0,
      prevAyr: "-",
      prevRtPd: "-",
      prevRate: "-",
      prevRv: "-",
      prevTax: "-",
      prevPen: 0,
      prevPenT: 0,
      // Diff
      diffCarpet: 32,
      diffBua: 60,
      diffRv: 1031,
      diffTax: 3620,
      diffStatus: "New",
      diffSuggestion: "Create New",
      // Current
      currProp: "105",
      currWing: "B/105",
      currType: "Flat",
      currFlr: "1",
      currYr: "2008",
      currCon: "RCC",
      currUse: "Residential",
      currRent: "-",
      currCarpet: 640,
      currBua: 840,
      currAyr: "2024-25",
      currRtPd: "2021-24",
      currRate: "8.00",
      currRv: "4,856",
      currTax: "14,401",
    },
    {
      id: 9,
      prevProp: "106",
      prevWing: "B/106",
      prevType: "Flat",
      prevFlr: "1",
      prevYr: "2008",
      prevCon: "RCC",
      prevUse: "Residential",
      prevRent: "-",
      prevCarpet: 0,
      prevBua: 0,
      prevAyr: "-",
      prevRtPd: "-",
      prevRate: "-",
      prevRv: "-",
      prevTax: "-",
      prevPen: 0,
      prevPenT: 0,
      // Diff
      diffCarpet: 0,
      diffBua: 0,
      diffRv: 0,
      diffTax: 0,
      diffStatus: "Missing",
      diffSuggestion: "Verify",
      // Current
      currProp: "106",
      currWing: "B/106",
      currType: "Flat",
      currFlr: "1",
      currYr: "2008",
      currCon: "RCC",
      currUse: "Residential",
      currRent: "-",
      currCarpet: 0,
      currBua: 0,
      currAyr: "-",
      currRtPd: "-",
      currRate: "-",
      currRv: "-",
      currTax: "-",
    }
  ];

  return (
    <div className="flex-grow flex-1 min-h-0 bg-[#f0f2f5] p-3 font-sans text-gray-850 animate-fadeIn relative">
      {/* 1. Header Overview Sections */}
      <div className="flex flex-wrap xl:flex-nowrap items-stretch gap-3 w-full font-sans mb-3">
        {/* Card 1: Main Property Info & Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3.5 flex flex-grow flex-wrap xl:flex-nowrap items-center gap-5 relative overflow-visible z-20">
          {/* Background visual accent */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#002fbe] rounded-l-xl pointer-events-none" />

          {/* Left building img */}
          <div className="relative w-36 h-28 shrink-0 rounded-lg overflow-hidden border border-gray-200 group cursor-pointer hover:border-blue-300 bg-gray-50 transition-all">
            <img 
              src="/municipal_building_front.png" 
              alt="Shree Sai Residency" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
            />
            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#002fbe] shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
              <Camera size={12} />
            </div>
          </div>

          {/* Details column */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-[#1749b5] uppercase tracking-wider font-extrabold">Apartment / Society</div>
                <div className="flex items-center gap-1.5 mt-0.5 relative">
                  <h2 className="text-[15px] font-black text-[#002a8f] tracking-wide select-all">SHREE SAI RESIDENCY CHS LTD</h2>
                  <button className="p-1 hover:bg-gray-150 rounded text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <Share2 size={13} />
                  </button>
                </div>
                <span className="bg-green-50 text-green-700 border border-green-200 text-[9px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider flex items-center gap-1 w-fit mt-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Active Property
                </span>
              </div>

              <div className="space-y-1 text-[11px] leading-tight mt-2.5">
                <div className="flex items-start">
                  <span className="font-bold text-[#1749b5] w-[110px] uppercase text-[9px] tracking-wider shrink-0 mt-0.5">Address</span>
                  <span className="font-bold text-[#1749b5] mr-2 shrink-0">:</span>
                  <span className="font-extrabold text-[#002a8f] text-left break-words max-w-[220px]">1A, Sai Baba Nagar, Thane (W) - 400601</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-[#1749b5] w-[110px] uppercase text-[9px] tracking-wider shrink-0">Property Type</span>
                  <span className="font-bold text-[#1749b5] mr-2 shrink-0">:</span>
                  <span className="font-extrabold text-[#002a8f]">Multi Wing Building</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-[#1749b5] w-[110px] uppercase text-[9px] tracking-wider shrink-0">Society Reg. No.</span>
                  <span className="font-bold text-[#1749b5] mr-2 shrink-0">:</span>
                  <span className="font-extrabold text-[#002a8f] uppercase">TMC/CHS/1234/2018</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-[#1749b5] w-[110px] uppercase text-[9px] tracking-wider shrink-0">Construction Type</span>
                  <span className="font-bold text-[#1749b5] mr-2 shrink-0">:</span>
                  <span className="font-extrabold text-[#002a8f]">RCC Framed Structure</span>
                </div>
              </div>
            </div>

            {/* Central property metadata */}
            <div className="md:col-span-4 border-l border-gray-150 pl-4 text-[10px] flex flex-col justify-between">
              <div className="grid grid-cols-1 gap-y-2.5">
                <div>
                  <div className="text-[#1749b5] font-extrabold uppercase tracking-wider text-[8.5px]">Property ID / UPIC</div>
                  <div className="flex items-center gap-1.5 mt-0.5 relative">
                    <span className="font-extrabold text-[#002a8f] text-[11px] tracking-wide select-all">UPIC-270465-APT-000567</span>
                    <button
                      onClick={handleCopyUpic}
                      className={`p-0.5 hover:bg-gray-150 rounded transition-colors cursor-pointer ${copiedUpic ? 'text-green-600' : 'text-[#1749b5]'}`}
                      title="Copy UPIC"
                    >
                      {copiedUpic ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-2.5">
                  <div>
                    <div className="text-[#1749b5] font-extrabold uppercase tracking-wider text-[8.5px]">Survey No.</div>
                    <div className="font-extrabold text-[#002a8f] text-[11px] mt-0.5">CSN005A</div>
                  </div>
                  <div>
                    <div className="text-[#1749b5] font-extrabold uppercase tracking-wider text-[8.5px]">Plot No.</div>
                    <div className="font-extrabold text-[#002a8f] text-[11px] mt-0.5">55</div>
                  </div>
                  <div>
                    <div className="text-[#1749b5] font-extrabold uppercase tracking-wider text-[8.5px]">SubZone No.</div>
                    <div className="font-extrabold text-[#002a8f] text-[11px] mt-0.5">A</div>
                  </div>
                  <div>
                    <div className="text-[#1749b5] font-extrabold uppercase tracking-wider text-[8.5px]">No. of Wings</div>
                    <div className="font-extrabold text-[#002a8f] text-[11px] mt-0.5">A - D (4 Wings)</div>
                  </div>
                </div>

                <div>
                  <div className="text-[#1749b5] font-extrabold uppercase tracking-wider text-[8.5px]">Ward</div>
                  <div className="font-extrabold text-[#002a8f] text-[11px] mt-0.5">W-12 (Manpada)</div>
                </div>
              </div>
            </div>

            {/* Area Stats */}
            <div className="md:col-span-3 border-l border-gray-150 pl-4 text-[10px] flex flex-col justify-between">
              <div className="min-w-[190px] shrink-0 space-y-2">
                {/* Carpet Area */}
                <div className="flex items-center gap-2 group relative">
                  <div className="bg-blue-50 p-1 rounded-md shrink-0 border border-blue-100/55">
                    <Ruler size={12} className="text-[#1749b5]" />
                  </div>
                  <div>
                    <div className="text-[8px] text-[#1749b5] font-extrabold uppercase tracking-wider">Total Carpet Area</div>
                    <div className="font-extrabold text-[10.5px] text-[#002a8f] mt-0.5">24,850.50 ft²</div>
                  </div>
                </div>

                {/* Built-up Area */}
                <div className="flex items-center gap-2 group relative">
                  <div className="bg-blue-50 p-1 rounded-md shrink-0 border border-blue-100/55">
                    <Layers size={12} className="text-[#1749b5]" />
                  </div>
                  <div>
                    <div className="text-[8px] text-[#1749b5] font-extrabold uppercase tracking-wider">Total Built-up Area</div>
                    <div className="font-extrabold text-[10.5px] text-[#002a8f] mt-0.5">33,450.75 ft²</div>
                  </div>
                </div>

                {/* Residential Units */}
                <div className="flex items-center gap-2 group relative">
                  <div className="bg-blue-50 p-1 rounded-md shrink-0 border border-blue-100/55">
                    <Home size={12} className="text-[#1749b5]" />
                  </div>
                  <div>
                    <div className="text-[8px] text-[#1749b5] font-extrabold uppercase tracking-wider">Residential Units</div>
                    <div className="font-extrabold text-[10.5px] text-[#002a8f] mt-0.5">40</div>
                  </div>
                </div>

                {/* Commercial Units */}
                <div className="flex items-center gap-2 group relative">
                  <div className="bg-blue-50 p-1 rounded-md shrink-0 border border-blue-100/55">
                    <Briefcase size={12} className="text-[#1749b5]" />
                  </div>
                  <div>
                    <div className="text-[8px] text-[#1749b5] font-extrabold uppercase tracking-wider">Commercial Units</div>
                    <div className="font-extrabold text-[10.5px] text-[#002a8f] mt-0.5">6</div>
                  </div>
                </div>

                {/* Other Units */}
                <div className="flex items-center gap-2 group relative">
                  <div className="bg-blue-50 p-1 rounded-md shrink-0 border border-blue-100/55">
                    <Star size={12} className="text-[#1749b5]" />
                  </div>
                  <div>
                    <div className="text-[8px] text-[#1749b5] font-extrabold uppercase tracking-wider">Other Units</div>
                    <div className="font-extrabold text-[10.5px] text-[#002a8f] mt-0.5">2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Card 2: Property Performance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3.5 flex flex-col justify-between w-full sm:w-[450px] shrink-0 relative group">
          {/* local linear gradient definition for half star */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient id="star-half-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
          </svg>

          {/* Card Title */}
          <div className="text-[13.5px] text-[#002fbe] font-bold select-none leading-none mb-2.5 border-b border-gray-100 pb-2">
            PROPERTY PERFORMANCE SUMMARY
          </div>

          {/* Two Columns Grid/Flexbox Layout */}
          <div className="flex flex-col sm:flex-row items-stretch gap-4 flex-grow">
            {/* Left Column: Property Grade */}
            <div className="w-full sm:w-[48%] flex flex-col justify-between pr-2.5 sm:border-r sm:border-gray-200">
              <div>
                <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">
                  Property Grade
                </div>
                <div className="flex text-orange-500 gap-0.5 mt-2 justify-start">
                  <Star size={14} fill="#f97316" className="stroke-orange-500" />
                  <Star size={14} fill="#f97316" className="stroke-orange-500" />
                  <Star size={14} fill="#f97316" className="stroke-orange-500" />
                  <Star size={14} fill="#f97316" className="stroke-orange-500" />
                  <Star size={14} fill="url(#star-half-orange)" className="stroke-orange-500" />
                  <Star size={14} fill="transparent" className="stroke-gray-300" />
                </div>
                <div className="text-[#002a8f] font-extrabold text-[26px] flex items-baseline leading-none mt-2 select-all font-sans">
                  <span>6.2</span>
                  <span className="text-[13px] text-[#1749b5] font-semibold ml-1">/ 7</span>
                </div>
              </div>
              <div className="mt-2.5">
                <div className="text-green-600 text-[12px] font-bold leading-tight">
                  A+ Grade
                </div>
                <div className="text-gray-500 text-[10.5px] font-medium leading-tight mt-0.5">
                  Excellent Property
                </div>
              </div>
            </div>

            {/* Right Column: Health Score */}
            <div className="w-full sm:w-[52%] flex flex-col justify-between pl-0 sm:pl-1">
              <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider leading-none">
                Health Score
              </div>
              
              <div className="flex items-center gap-3.5 mt-1.5 flex-grow">
                {/* Circle progress - Compact */}
                <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                  <svg width="64" height="64" viewBox="0 0 64 64" className="transform -rotate-90">
                    <circle cx="32" cy="32" r="25" stroke="#10b981" strokeWidth="5" strokeOpacity="0.2" fill="transparent" />
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="25" 
                      stroke="#047857" 
                      strokeWidth="5" 
                      fill="transparent" 
                      strokeDasharray="157.1" 
                      strokeDashoffset="12.6" 
                      strokeLinecap="round" 
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute font-black text-[13px] text-[#002a8f] select-none">92%</div>
                </div>

                {/* Stats right */}
                <div className="flex-1 flex flex-col justify-center leading-none">
                  <div>
                    <div className="font-extrabold text-[24px] text-[#002a8f] select-all">92%</div>
                    <div className="text-green-600 text-[11px] font-bold mt-1.5 select-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Excellent
                    </div>
                  </div>
                  <button className="text-[#002fbe] text-[9.5px] font-bold mt-2.5 hover:bg-[#002fbe] hover:text-white border border-[#002fbe] rounded-lg px-2 py-0.5 bg-white w-fit shadow-2xs cursor-pointer select-none transition-all">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Verification Badges Row */}
      <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-xs flex flex-wrap items-center justify-between gap-y-1.5 shrink-0 select-none mb-3">
        <StatusBadge icon={<CheckCircle2 size={13} className="text-green-600" />} title="GIS Verified" status="Verified" statusColor="text-green-600" />
        <StatusBadge icon={<CheckCircle2 size={13} className="text-green-600" />} title="Assessment" status="Approved" statusColor="text-green-600" />
        <StatusBadge icon={<Wallet size={13} className="text-green-600" />} title="Collection Status" status="Paid" statusColor="text-green-600" />
        <StatusBadge icon={<UserCheck size={13} className="text-green-600" />} title="KYC Status" status="Verified" statusColor="text-green-600" />
        <StatusBadge icon={<Droplet size={13} className="text-blue-600" />} title="Water Connection" status="Active" statusColor="text-green-600" isBlue />
        <StatusBadge icon={<ShieldCheck size={13} className="text-green-600" />} title="Fire NOC" status="Valid" statusColor="text-green-600" />
        <StatusBadge icon={<Briefcase size={13} className="text-green-600" />} title="Trade License" status="Active" statusColor="text-green-600" />
        <StatusBadge icon={<Link2 size={13} className="text-green-600" />} title="BPMS Linked" status="Yes" statusColor="text-green-600" />
      </div>

      {/* Main Split Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-3 items-start flex-1 min-h-0 w-full">
        {/* Left Column: Wing Summary, Table, Metrics */}
        <div className="flex-1 flex flex-col gap-3 min-h-0 w-full lg:w-0">
          
          {/* 3. Wing Summary Mini-Dashboard Grid */}
          <div ref={summaryRef} className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs relative overflow-visible">
            {/* Section Title & Legend Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 px-1 gap-2 select-none">
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-[12.5px] font-black text-[#1e2b58] tracking-tight uppercase">Wing Summary</h3>
                <span className="text-[9.5px] text-gray-450 font-bold">(Mini Dashboard)</span>
              </div>
              
              {/* Legend Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[9.5px] font-bold text-gray-500/90">
                <span className="flex items-center gap-1">
                  <span className="text-green-600 font-black text-[10px]">A+</span>
                  <span className="text-gray-450">: Excellent (90%+)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-500 font-black text-[10px]">A</span>
                  <span className="text-gray-450">: Good (75-90%)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-orange-500 font-black text-[10px]">B</span>
                  <span className="text-gray-450">: Average (50-75%)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-amber-500 font-black text-[10px]">C</span>
                  <span className="text-gray-450">: Poor (&lt;50%)</span>
                </span>
              </div>
            </div>

            {/* Horizontal row of Wing cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
              {wings.map((wing) => (
                <WingCard 
                  key={wing.wing}
                  wing={wing}
                  activeMetric={activeMetrics[wing.id] || 'discount'}
                  onMetricClick={handleMetricClick}
                  onDeleteClick={handleDeleteWing}
                />
              ))}
              
              {/* Add Wing Card */}
              <button 
                onClick={() => {
                  setFormErrors({});
                  setSubmitSuccess(false);
                  setAddWingModalOpen(true);
                }}
                className="flex flex-col justify-center items-center bg-white border border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/10 cursor-pointer transition-all p-2.5 h-full focus:ring-1 focus:ring-blue-500 outline-none w-full"
                aria-label="Add new Wing"
              >
                <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 text-[#3b82f6]">
                  <Plus size={15} />
                </div>
                <span className="text-[10px] font-black text-[#3b82f6] mt-2 uppercase tracking-wider">Add Wing</span>
              </button>
            </div>
          </div>

          {/* 4. Tabs & Sub-Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-1">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-150 px-4 py-2 gap-2">
              <div className="flex flex-wrap gap-1 text-[11px] font-extrabold text-gray-500">
                <TabButton label="Wing Overview" active={activeTab === 'wing-overview'} onClick={() => setActiveTab('wing-overview')} />
                <TabButton label="Floor / Unit Comparison" active={activeTab === 'floor-comparison'} onClick={() => setActiveTab('floor-comparison')} />
                <TabButton label="Headwise Tax Comparison" active={activeTab === 'tax-comparison'} onClick={() => setActiveTab('tax-comparison')} />
                <TabButton label="Assessment Comparison" active={activeTab === 'assessment-comparison'} onClick={() => setActiveTab('assessment-comparison')} />
                <TabButton label="Society Details" active={activeTab === 'society-details'} onClick={() => setActiveTab('society-details')} />
                <TabButton label="Documents" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
                <TabButton label="Discount & Exemption" active={activeTab === 'discount-exemption'} onClick={() => setActiveTab('discount-exemption')} />
                <TabButton label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                <TabButton label="Old Details" active={activeTab === 'old-details'} onClick={() => setActiveTab('old-details')} />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#edf2ff] text-[#3b82f6] rounded-lg text-[10px] font-extrabold border border-[#3b82f6]/10 hover:bg-[#dbeafe] transition cursor-pointer">
                <Layers size={12} />
                <span>Comparison Summary</span>
              </button>
            </div>

            {/* Sub-Filters / Legend Row */}
            <div className="flex flex-col lg:flex-row items-center justify-between p-3 gap-3 bg-gray-50/50 rounded-b-xl">
              <div className="flex flex-wrap items-center gap-4">
                {/* Wing Select */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Select Wing</span>
                  <div className="relative">
                    <select 
                      value={selectedWing} 
                      onChange={(e) => setSelectedWing(e.target.value)}
                      className="appearance-none bg-white border border-gray-250 rounded-lg pl-3 pr-8 py-1 text-[11px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option>B Wing (19)</option>
                      <option>A Wing (19)</option>
                      <option>C Wing (15)</option>
                      <option>D Wing (14)</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Floor Select */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Select Floor</span>
                  <div className="relative">
                    <select 
                      value={selectedFloor} 
                      onChange={(e) => setSelectedFloor(e.target.value)}
                      className="appearance-none bg-white border border-gray-250 rounded-lg pl-3 pr-8 py-1 text-[11px] font-bold text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option>All Floors</option>
                      <option>Ground Floor</option>
                      <option>1st Floor</option>
                      <option>2nd Floor</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Legend Indicators */}
                <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-gray-500">
                  <LegendItem color="bg-green-500" label="Matched" />
                  <LegendItem color="bg-amber-500" label="Modified" />
                  <LegendItem color="bg-blue-500" label="New" />
                  <LegendItem color="bg-red-500" label="Missing" />
                  <LegendItem color="bg-purple-500" label="Eligible for Discount" />
                  <LegendItem color="bg-teal-500" label="Exempted" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Show Rows */}
                <span className="text-[10px] text-gray-400 font-bold uppercase">Show</span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-250 rounded-lg pl-3 pr-8 py-1 text-[11px] font-bold text-gray-700 outline-none cursor-pointer">
                    <option>20 rows</option>
                    <option>50 rows</option>
                    <option>100 rows</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                {/* Filters Button */}
                <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-250 bg-white rounded-lg text-[10px] font-extrabold text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <SlidersHorizontal size={12} />
                  <span>Filters</span>
                </button>

                {/* Export Button */}
                <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-250 bg-white rounded-lg text-[10px] font-extrabold text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <Download size={12} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5. Main Comparison Table Container (Independent Horizontal Scroll) */}
          <div className="w-full flex flex-col border border-gray-200 rounded-xl shadow-xs overflow-hidden bg-white select-none">
            <div className="w-full flex divide-x divide-gray-200">
            
            {/* LEFT TABLE: Existing Assessment (Previous) */}
            <div className="w-[41%] shrink-0 flex flex-col overflow-hidden bg-white">
              {/* Header block with green tint gradient */}
              <div className="bg-[#edf7f4] border-b border-gray-200 px-3 py-1.5 flex items-center justify-between h-[34px] shrink-0">
                <div className="flex items-center gap-1 select-none">
                  <span className="text-[10px] font-black text-[#006a4e] uppercase tracking-tight">Existing Assessment</span>
                  <span className="text-[9.5px] text-[#006a4e]/75 font-semibold">(Previous)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
                    View Grouped
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <ChevronUp size={11} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <Plus size={11} className="rotate-45" />
                  </button>
                </div>
              </div>
              
              {/* Horizontal scroll wrapper for left table */}
              <div className="overflow-x-auto w-full scrollbar-thin">
                <table className="min-w-[1100px] text-left border-collapse text-[10px] w-full">
                  <thead>
                    <tr className="bg-[#edf7f4]/45 border-b border-gray-200 text-[#006a4e] font-black uppercase h-[32px]">
                      <th className="py-2 px-1.5 text-center w-8 whitespace-nowrap">#</th>
                      <th className="py-2 px-1.5 whitespace-nowrap">Prop No.</th>
                      <th className="py-2 px-1.5 whitespace-nowrap">Wing/Flat</th>
                      <th className="py-2 px-1.5 w-10 whitespace-nowrap">Type</th>
                      <th className="py-2 px-1.5 text-center w-7 whitespace-nowrap">Flr</th>
                      <th className="py-2 px-1.5 text-center w-12 whitespace-nowrap">Con Yr</th>
                      <th className="py-2 px-1.5 w-14 whitespace-nowrap">Con Type</th>
                      <th className="py-2 px-1.5 whitespace-nowrap">Use</th>
                      <th className="py-2 px-1.5 text-right w-16 whitespace-nowrap">Rent/mo (₹)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Carpet (ft²)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">BUA (ft²)</th>
                      <th className="py-2 px-1.5 text-center whitespace-nowrap">AYR</th>
                      <th className="py-2 px-1.5 text-center whitespace-nowrap">RtPd</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Rate %</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">RV (₹)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Tax (₹)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Rt Tax (₹)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Pen (₹)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Pen(T) (₹)</th>
                      <th className="py-2 px-1.5 text-center w-16 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {comparisonRows.map((row, index) => {
                      return (
                        <tr key={index} className="hover:bg-blue-50/45 transition-colors h-[38px] bg-white text-[#1d2d5c]">
                          <td className="py-2 px-1.5 text-center font-bold text-gray-400 whitespace-nowrap">{row.id}</td>
                          <td className="py-2 px-1.5 font-bold whitespace-nowrap">{row.prevProp}</td>
                          <td className="py-2 px-1.5 font-semibold whitespace-nowrap">{row.prevWing}</td>
                          <td className="py-2 px-1.5 whitespace-nowrap">{row.prevType}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">{row.prevFlr}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">{row.prevYr}</td>
                          <td className="py-2 px-1.5 whitespace-nowrap">{row.prevCon}</td>
                          <td className="py-2 px-1.5 whitespace-nowrap">{row.prevUse}</td>
                          <td className="py-2 px-1.5 text-right font-semibold whitespace-nowrap">{row.prevRent}</td>
                          <td className="py-2 px-1.5 text-right font-bold whitespace-nowrap">{row.prevCarpet || '-'}</td>
                          <td className="py-2 px-1.5 text-right font-bold whitespace-nowrap">{row.prevBua || '-'}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">{row.prevAyr}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">{row.prevRtPd}</td>
                          <td className="py-2 px-1.5 text-right whitespace-nowrap">{row.prevRate}</td>
                          <td className="py-2 px-1.5 text-right font-bold whitespace-nowrap">{row.prevRv}</td>
                          <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">{row.prevTax}</td>
                          <td className="py-2 px-1.5 text-right font-bold whitespace-nowrap">{row.prevTax}</td>
                          <td className="py-2 px-1.5 text-right text-red-500 font-semibold whitespace-nowrap">{row.prevPen || '0'}</td>
                          <td className="py-2 px-1.5 text-right text-red-650 font-bold whitespace-nowrap">{row.prevPenT || '0'}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">
                            <span className={`font-bold text-[9.5px] ${
                              row.diffStatus === 'Matched' ? 'text-green-600' :
                              row.diffStatus === 'Modified' ? 'text-amber-600' :
                              row.diffStatus === 'New' ? 'text-blue-600' :
                              row.diffStatus === 'Missing' ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {row.diffStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Totals Row */}
                    <tr className="bg-gray-50 font-bold border-t border-gray-200 h-[38px] text-[#1d2d5c]">
                      <td colSpan={9} className="py-2 px-3 text-left uppercase text-[9px] font-black whitespace-nowrap">Total (19 Units)</td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">4,456</td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">5,950</td>
                      <td colSpan={4}></td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">63,475</td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">2,10,039</td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">2,10,039</td>
                      <td className="py-2 px-1.5 text-right text-red-600 font-black whitespace-nowrap">7,520</td>
                      <td className="py-2 px-1.5 text-right text-red-600 font-black whitespace-nowrap">500</td>
                      <td className="whitespace-nowrap"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* MIDDLE COLUMN: Difference Engine */}
            <div className="w-[18%] shrink-0 flex flex-col overflow-hidden bg-[#fffdf5] border-l border-r border-gray-200">
              {/* Header block with yellow tint gradient */}
              <div className="bg-[#fdf8e2] border-b border-amber-250/60 px-3 py-1.5 flex items-center justify-between h-[34px] shrink-0">
                <span className="text-[10px] font-black text-[#8a6d1c] uppercase tracking-tight">Difference Engine</span>
                <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
                  AI Status
                </button>
              </div>
              
              <div className="w-full overflow-x-auto no-scrollbar">
                <table className="min-w-[420px] text-left border-collapse text-[10px] w-full">
                  <thead>
                    <tr className="bg-[#fdf8e2]/60 border-b border-amber-200 text-[#8a6d1c] font-black uppercase h-[32px]">
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Carpet Δ</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">BUA Δ</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">RV Δ (₹)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Tax Δ (₹)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Rt Tax Δ</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Pen Δ</th>
                      <th className="py-2 px-1.5 text-center whitespace-nowrap">Suggestion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {comparisonRows.map((row, index) => {
                      return (
                        <tr key={index} className="hover:bg-blue-50/45 transition-colors h-[38px] bg-white text-[#1d2d5c]">
                          <td className={`py-2 px-1.5 text-right font-bold whitespace-nowrap ${row.diffCarpet !== 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-medium'}`}>
                            {row.diffCarpet > 0 ? `+${row.diffCarpet}` : row.diffCarpet < 0 ? row.diffCarpet : '0'}
                          </td>
                          <td className={`py-2 px-1.5 text-right font-bold whitespace-nowrap ${row.diffBua !== 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-medium'}`}>
                            {row.diffBua > 0 ? `+${row.diffBua}` : row.diffBua < 0 ? row.diffBua : '0'}
                          </td>
                          <td className={`py-2 px-1.5 text-right font-bold whitespace-nowrap ${row.diffRv !== 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-medium'}`}>
                            {row.diffRv > 0 ? `+${row.diffRv}` : row.diffRv < 0 ? row.diffRv : '0'}
                          </td>
                          <td className={`py-2 px-1.5 text-right font-bold whitespace-nowrap ${row.diffTax !== 0 ? 'text-red-500 font-extrabold' : 'text-gray-400 font-medium'}`}>
                            {row.diffTax > 0 ? `+${row.diffTax}` : row.diffTax < 0 ? row.diffTax : '0'}
                          </td>
                          <td className="py-2 px-1.5 text-right text-gray-400 font-medium whitespace-nowrap">0</td>
                          <td className="py-2 px-1.5 text-right text-gray-400 font-medium whitespace-nowrap">0</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">
                            {row.diffSuggestion !== '-' ? (
                              <button className="text-[8.5px] bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] hover:bg-[#dcfce7] transition px-2 py-0.5 rounded font-extrabold cursor-pointer leading-none">
                                {row.diffSuggestion}
                              </button>
                            ) : (
                              <span className="text-gray-400 font-bold">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Totals Row */}
                    <tr className="bg-gray-50 font-bold border-t border-gray-200 h-[38px] text-[#1d2d5c]">
                      <td className="py-2 px-1.5 text-right text-red-500 font-black whitespace-nowrap">+124</td>
                      <td className="py-2 px-1.5 text-right text-red-500 font-black whitespace-nowrap">+200</td>
                      <td className="py-2 px-1.5 text-right text-red-500 font-black whitespace-nowrap">+3,917</td>
                      <td className="py-2 px-1.5 text-right text-red-500 font-black whitespace-nowrap">+11,680</td>
                      <td className="py-2 px-1.5 text-right text-gray-400 font-black whitespace-nowrap">0</td>
                      <td className="py-2 px-1.5 text-right text-gray-400 font-black whitespace-nowrap">0</td>
                      <td className="whitespace-nowrap"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT TABLE: New Survey (Current) */}
            <div className="w-[41%] shrink-0 flex flex-col overflow-hidden bg-white">
              {/* Header block with blue tint gradient */}
              <div className="bg-[#edf2ff] border-b border-gray-200 px-3 py-1.5 flex items-center justify-between h-[34px] shrink-0">
                <div className="flex items-center gap-1 select-none">
                  <span className="text-[10px] font-black text-[#1e40af] uppercase tracking-tight">New Survey</span>
                  <span className="text-[9.5px] text-[#1e40af]/75 font-semibold">(Current)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="text-[8.5px] font-bold text-blue-600 bg-white border border-gray-200 hover:bg-gray-50 rounded px-1.5 py-0.5 shadow-2xs leading-none">
                    View Grouped
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <ChevronUp size={11} />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <Plus size={11} className="rotate-45" />
                  </button>
                </div>
              </div>
              
              {/* Horizontal scroll wrapper for right table */}
              <div className="overflow-x-auto w-full scrollbar-thin">
                <table className="min-w-[1100px] text-left border-collapse text-[10px] w-full">
                  <thead>
                    <tr className="bg-[#edf2ff]/45 border-b border-gray-200 text-[#1e40af] font-black uppercase h-[32px]">
                      <th className="py-2 px-1.5 text-center w-8 whitespace-nowrap">#</th>
                      <th className="py-2 px-1.5 whitespace-nowrap">Prop/Flat</th>
                      <th className="py-2 px-1.5 w-10 whitespace-nowrap">Type</th>
                      <th className="py-2 px-1.5 text-center w-7 whitespace-nowrap">Flr</th>
                      <th className="py-2 px-1.5 text-center w-12 whitespace-nowrap">Con Yr</th>
                      <th className="py-2 px-1.5 w-14 whitespace-nowrap">Con Type</th>
                      <th className="py-2 px-1.5 whitespace-nowrap">Use</th>
                      <th className="py-2 px-1.5 text-right w-16 whitespace-nowrap">Rent/mo (₹)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Carpet (ft²)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">BUA (ft²)</th>
                      <th className="py-2 px-1.5 text-center whitespace-nowrap">AYR-C</th>
                      <th className="py-2 px-1.5 text-center whitespace-nowrap">RtPd-C</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">Rate %</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">RV-C (₹)</th>
                      <th className="py-2 px-1.5 text-right whitespace-nowrap">RTx-C (₹)</th>
                      <th className="py-2 px-1.5 text-center whitespace-nowrap">Party Details</th>
                      <th className="py-2 px-1.5 text-center whitespace-nowrap">Images</th>
                      <th className="py-2 px-1.5 text-center whitespace-nowrap">Doc</th>
                      <th className="py-2 px-1.5 text-center w-16 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {comparisonRows.map((row, index) => {
                      return (
                        <tr key={index} className="hover:bg-blue-50/45 transition-colors h-[38px] bg-white text-[#1d2d5c]">
                          <td className="py-2 px-1.5 text-center font-bold text-gray-400 whitespace-nowrap">{row.id}</td>
                          <td className="py-2 px-1.5 font-bold whitespace-nowrap">{row.currProp}</td>
                          <td className="py-2 px-1.5 whitespace-nowrap">{row.currType}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">{row.currFlr}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">{row.currYr}</td>
                          <td className="py-2 px-1.5 whitespace-nowrap">{row.currCon}</td>
                          <td className="py-2 px-1.5 whitespace-nowrap">{row.currUse}</td>
                          <td className="py-2 px-1.5 text-right font-semibold whitespace-nowrap">{row.currRent}</td>
                          <td className="py-2 px-1.5 text-right font-bold whitespace-nowrap">{row.currCarpet || '-'}</td>
                          <td className="py-2 px-1.5 text-right font-bold whitespace-nowrap">{row.currBua || '-'}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">{row.currAyr}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">{row.currRtPd}</td>
                          <td className="py-2 px-1.5 text-right whitespace-nowrap">{row.currRate}</td>
                          <td className="py-2 px-1.5 text-right font-bold whitespace-nowrap">{row.currRv}</td>
                          <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">{row.currTax}</td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">
                            {row.currProp !== '106' ? (
                              <span className="text-[10px] text-[#3b82f6] hover:underline cursor-pointer font-bold select-none">
                                Owner
                              </span>
                            ) : (
                              <span className="text-gray-400 font-bold">-</span>
                            )}
                          </td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">
                            {row.currProp !== '106' ? (
                              <button className="text-gray-400 hover:text-blue-650 transition inline-block cursor-pointer">
                                <ImageIcon size={13} />
                              </button>
                            ) : (
                              <span className="text-gray-400 font-bold">-</span>
                            )}
                          </td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">
                            {row.currProp !== '106' ? (
                              <button className="text-gray-400 hover:text-blue-650 transition inline-block cursor-pointer">
                                <FileText size={13} />
                              </button>
                            ) : (
                              <span className="text-gray-400 font-bold">-</span>
                            )}
                          </td>
                          <td className="py-2 px-1.5 text-center whitespace-nowrap">
                            <span className={`font-bold text-[9.5px] ${
                              row.diffStatus === 'Matched' ? 'text-green-600' :
                              row.diffStatus === 'Modified' ? 'text-amber-600' :
                              row.diffStatus === 'New' ? 'text-blue-600' :
                              row.diffStatus === 'Missing' ? 'text-red-500' : 'text-gray-500'
                            }`}>
                              {row.diffStatus === 'Missing' ? 'Not Found' : row.diffStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {/* Totals Row */}
                    <tr className="bg-gray-50 font-bold border-t border-gray-200 h-[38px] text-[#1d2d5c]">
                      <td colSpan={8} className="py-2 px-3 text-left uppercase text-[9px] font-black whitespace-nowrap">Total</td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">4,768</td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">6,240</td>
                      <td colSpan={3}></td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">73,392</td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">2,21,719</td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">5,730</td>
                      <td className="py-2 px-1.5 text-right font-black whitespace-nowrap">500</td>
                      <td className="whitespace-nowrap"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            </div>

            {/* Footer info labels inside table card */}
            <div className="flex flex-col md:flex-row items-center justify-between p-3 bg-gray-50/50 border-t border-gray-100 text-[10px] font-bold text-gray-400 rounded-b-xl">
              <div>* Note: Click on any row to view detailed comparison, photos, documents and history.</div>
              <div>Click on <Layers size={11} className="inline mr-1 text-[#3b82f6]" /> to view complete Tax Rules & Discounts policy for the record.</div>
            </div>
          </div>

          {/* 6. Bottom Dashboard Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Area Comparison */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">Area Comparison</span>
              <div className="my-1 space-y-1.5">
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold block leading-none">Carpet Diff.</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[15px] font-black text-gray-700">+312 ft²</span>
                    <span className="text-[9px] text-green-500 font-extrabold">(+6.98%)</span>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold block leading-none">BUA Diff.</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[15px] font-black text-gray-700">+290 ft²</span>
                    <span className="text-[9px] text-green-500 font-extrabold">(+4.87%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Comparison */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">Assessment Comparison</span>
              <div className="my-1 space-y-1.5">
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold block leading-none">RV Diff.</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[15px] font-black text-gray-700">+₹ 5,821</span>
                    <span className="text-[9px] text-green-500 font-extrabold">(+16.33%)</span>
                  </div>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold block leading-none">Tax Diff.</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[15px] font-black text-gray-700">+₹ 10,105</span>
                    <span className="text-[9px] text-green-500 font-extrabold">(+8.16%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapping Status Donut Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase mb-1">Mapping Status</span>
              <div className="flex items-center gap-3">
                {/* SVG Donut */}
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                    {/* Matched (58.3%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="58 100" strokeDashoffset="0" />
                    {/* Modified (25%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="25 100" strokeDashoffset="-58" />
                    {/* New (8.3%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="8.3 100" strokeDashoffset="-83" />
                    {/* Missing (8.3%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="8.7 100" strokeDashoffset="-91.3" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center leading-none text-gray-400">
                    <span className="text-[8px] font-bold">Total</span>
                    <span className="text-[11px] font-black text-gray-700">48</span>
                  </div>
                </div>
                <div className="text-[9px] space-y-0.5 text-gray-500 font-semibold flex-1">
                  <div className="flex justify-between"><span className="text-green-600 font-extrabold">Matched</span> <span>28</span></div>
                  <div className="flex justify-between"><span className="text-amber-600 font-extrabold">Modified</span> <span>12</span></div>
                  <div className="flex justify-between"><span className="text-blue-600 font-extrabold">New</span> <span>4</span></div>
                  <div className="flex justify-between"><span className="text-red-600 font-extrabold">Missing</span> <span>4</span></div>
                </div>
              </div>
            </div>

            {/* Revenue Insight */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">Revenue Insight</span>
              <div className="my-1 space-y-1">
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold block leading-none">Potential Revenue</span>
                  <span className="text-[15px] font-black text-gray-800">₹ 5,821</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-semibold block leading-none">Revenue Leakage</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[15px] font-black text-red-500">₹ 3,298</span>
                    <span className="text-[9px] text-red-500 font-extrabold">(7.02%)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold pt-1 border-t border-gray-50 mt-1">
                  <span className="text-gray-400">Efficiency</span>
                  <span className="text-green-500 font-extrabold">87.64% ▲</span>
                </div>
              </div>
            </div>

            {/* Comparison Completion radial progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex flex-col justify-between items-center text-center">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase block w-full text-left">Comparison Completion</span>
              
              <div className="relative w-12 h-12 my-1">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeDasharray="85 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
                  <span className="text-[12px] font-black">85%</span>
                </div>
              </div>

              <div className="text-[9px] font-bold text-gray-500 leading-tight">
                <div>41 / 48 Units</div>
                <button className="text-blue-500 hover:underline text-[8.5px] cursor-pointer">View Incomplete (7)</button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm flex flex-col justify-between gap-1">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase">Quick Filters</span>
              
              <div className="space-y-1">
                <select className="w-full bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-600 outline-none">
                  <option>All Status</option>
                  <option>Matched</option>
                  <option>Modified</option>
                  <option>New</option>
                  <option>Missing</option>
                </select>
                <select className="w-full bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-gray-600 outline-none">
                  <option>All Use</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                </select>
              </div>

              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-black py-0.5 rounded transition cursor-pointer">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Town All Wings + Media Stack */}
        <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-3.5 h-full select-none">
          
          {/* Town All Wings Summary Panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-500">
                <Building2 size={12} className="text-[#3b82f6]" />
                <span className="text-[9.5px] font-black text-gray-400 uppercase tracking-wider">Total Units</span>
              </div>
              <span className="text-[15px] font-black text-[#1e2b58]">48</span>
            </div>

            <div className="space-y-1.5 my-2">
              <ProgressRow dotColor="bg-green-500" label="Matched" val="28" pct="58.33%" />
              <ProgressRow dotColor="bg-[#f97316]" label="Modified" val="12" pct="25.00%" />
              <ProgressRow dotColor="bg-blue-500" label="New" val="4" pct="8.33%" />
              <ProgressRow dotColor="bg-red-500" label="Missing" val="4" pct="8.33%" />
            </div>

            <div className="pt-2 border-t border-gray-150">
              <div className="flex justify-between items-center text-[9px] font-extrabold text-gray-400">
                <span>Comparison Completion</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-green-600 font-extrabold text-[10px]">85%</span>
              </div>
            </div>
          </div>

          {/* Media Section: Building Plan */}
          <div 
            onMouseEnter={() => handleHoverImage("/blueprint_plan.png", "left")} 
            onMouseLeave={() => handleHoverImage(null)} 
            onClick={() => {
              setSelectedImg("/blueprint_plan.png");
              setSelectedImgTitle("Building Plan (Typical Floor)");
            }}
            className="bg-white border border-gray-200 hover:border-blue-500 rounded-xl p-2.5 flex flex-col shadow-xs hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
            role="button"
            aria-label="Open Building Plan preview"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                setSelectedImg("/blueprint_plan.png");
                setSelectedImgTitle("Building Plan (Typical Floor)");
              }
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9.5px] font-black text-[#1e2b58] uppercase tracking-wider">Building Plan <span className="text-[8px] text-gray-400 lowercase font-medium">(Typical Floor)</span></span>
              <Maximize2 size={10} className="text-gray-400 group-hover:text-[#002fbe] transition-colors" />
            </div>
            <div className="overflow-hidden rounded-lg w-full h-[105px] bg-gray-50 flex items-center justify-center border border-dashed border-gray-200">
              <img src="/blueprint_plan.png" className="w-full h-full object-contain rounded" alt="Building Plan" />
            </div>
          </div>

          {/* Media Section: GIS / Satellite View */}
          <div className="flex flex-col">
            <MapBox 
              title="GIS / Satellite View" 
              imgUrl="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=400&auto=format&fit=crop" 
              onZoom={() => {
                setSelectedImg("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop");
                setSelectedImgTitle("GIS / Satellite View");
              }}
              onHover={(url: string | null) => handleHoverImage(url, "left")}
            />
          </div>

          {/* Media Section: Street View */}
          <div className="flex flex-col">
            <MapBox 
              title="Street View" 
              imgUrl="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=400&auto=format&fit=crop" 
              onZoom={() => {
                setSelectedImg("https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop");
                setSelectedImgTitle("Street View");
              }}
              onHover={(url: string | null) => handleHoverImage(url, "left")}
            />
          </div>

          {/* Media Section: Change Detection */}
          <div className="flex flex-col">
            <ChangeDetectionBox 
              title="Change Detection" 
              beforeImg="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400&auto=format&fit=crop" 
              afterImg="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop" 
              beforeImgZoom="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
              afterImgZoom="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
              onHover={(url: string | null) => handleHoverImage(url, "left")}
              onZoom={() => {
                setSelectedImg("change-detection");
                setSelectedImgTitle("Change Detection Slider");
              }} 
            />
          </div>

        </div>

      </div>

      {/* Floating Hover Zoom Portal */}
      {hoveredImg && (
        <div className={`fixed z-50 w-96 bg-white border border-gray-300 rounded-xl shadow-2xl p-2.5 pointer-events-none animate-fadeIn flex flex-col gap-2 ${hoverPosition === 'left' ? 'right-[305px] top-[180px]' : 'left-[305px] top-[180px]'}`}>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex justify-between">
            <span>Complete Zoom View</span>
            <span className="text-[#1e2b58] font-semibold text-[8px] bg-blue-50 px-1 py-0.25 rounded">Live Preview</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50 h-72 w-full flex items-center justify-center">
            <img src={hoveredImg} className="w-full h-full object-contain" alt="Complete Zoom" />
          </div>
        </div>
      )}

      {/* Enlarged Lightbox Modal */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-[999] cursor-zoom-out animate-fadeIn font-sans"
        >
          <div className="relative max-w-4xl max-h-[88vh] p-3.5 bg-white rounded-xl shadow-2xl cursor-default" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-150">
              <span className="font-extrabold text-[#002fbe] text-[10.5px] uppercase tracking-wider">
                {selectedImgTitle || 'Enlarged Preview'}
              </span>
              <button 
                onClick={() => setSelectedImg(null)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 font-extrabold text-[13px] cursor-pointer"
              >
                ×
              </button>
            </div>
            
            {/* Custom Enlarged Change Detection Slider rendering */}
            {selectedImg === 'change-detection' ? (
              <div className="w-[600px] h-[360px] relative overflow-hidden rounded-lg border border-gray-200">
                <ChangeDetectionBox 
                  title="Change Detection (Enlarged)" 
                  beforeImg="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop" 
                  afterImg="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" 
                  beforeImgZoom="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop"
                  afterImgZoom="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                  onHover={() => {}}
                  onZoom={() => {}}
                  isEnlarged
                />
              </div>
            ) : (
              <img src={selectedImg} alt="Large Preview" className="max-w-full max-h-[75vh] rounded-lg object-contain animate-scaleIn" />
            )}
            
            <div className="text-center text-xs text-gray-400 mt-2.5 font-medium select-none">Click outside or press Escape to close</div>
          </div>
        </div>
      )}

      {/* Add Wing Modal */}
      {addWingModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center animate-fadeIn p-4 overflow-y-auto font-sans">
          <div 
            className="bg-white border border-[#002fbe]/20 rounded-xl shadow-2xl p-5 w-full max-w-xl animate-scaleIn flex flex-col gap-4 relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-wing-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-150">
              <h3 id="add-wing-title" className="font-extrabold text-[#002fbe] text-[13px] uppercase tracking-wider flex items-center gap-1.5 select-none">
                <Plus size={15} /> Add New Wing
              </h3>
              <button 
                onClick={() => setAddWingModalOpen(false)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-extrabold text-[13px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                ×
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
                  <Check size={20} />
                </div>
                <h4 className="font-bold text-green-600 text-sm">Wing Added Successfully!</h4>
                <p className="text-[11px] text-gray-500">The new Wing card has been inserted into the Summary.</p>
              </div>
            ) : (
              <form onSubmit={handleAddWingSubmit} className="flex flex-col gap-3.5 text-[11px] font-semibold text-gray-600">
                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                  {/* Wing Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Wing Name *</label>
                    <input 
                      type="text"
                      placeholder="e.g. E Wing"
                      value={formValues.wingName}
                      onChange={(e) => setFormValues({...formValues, wingName: e.target.value})}
                      className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.wingName ? 'border-red-400' : 'border-gray-250'}`}
                    />
                    {formErrors.wingName && <span className="text-red-500 text-[9px] font-bold">{formErrors.wingName}</span>}
                  </div>

                  {/* Block Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Block Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Lotus Block"
                      value={formValues.blockName}
                      onChange={(e) => setFormValues({...formValues, blockName: e.target.value})}
                      className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Grade */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Grade *</label>
                    <select
                      value={formValues.grade}
                      onChange={(e) => setFormValues({...formValues, grade: e.target.value})}
                      className="border border-gray-250 px-2 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option>A+</option>
                      <option>A</option>
                      <option>B+</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>

                  {/* Theme Color */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Theme Color *</label>
                    <select
                      value={formValues.themeColor}
                      onChange={(e) => setFormValues({...formValues, themeColor: e.target.value})}
                      className="border border-gray-250 px-2 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="blue">Blue (Default)</option>
                      <option value="green">Green</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                    </select>
                  </div>

                  {/* Floors */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Number of Floors</label>
                    <input 
                      type="number"
                      value={formValues.floors}
                      onChange={(e) => setFormValues({...formValues, floors: e.target.value})}
                      className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.floors ? 'border-red-400' : 'border-gray-250'}`}
                    />
                    {formErrors.floors && <span className="text-red-500 text-[9px] font-bold">{formErrors.floors}</span>}
                  </div>

                  {/* Total Units */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Total Units</label>
                    <input 
                      type="number"
                      value={formValues.units}
                      onChange={(e) => setFormValues({...formValues, units: e.target.value})}
                      className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.units ? 'border-red-400' : 'border-gray-250'}`}
                    />
                    {formErrors.units && <span className="text-red-500 text-[9px] font-bold">{formErrors.units}</span>}
                  </div>

                  {/* Res Units */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Residential Units</label>
                    <input 
                      type="number"
                      value={formValues.res}
                      onChange={(e) => setFormValues({...formValues, res: e.target.value})}
                      className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.res ? 'border-red-400' : 'border-gray-250'}`}
                    />
                    {formErrors.res && <span className="text-red-500 text-[9px] font-bold">{formErrors.res}</span>}
                  </div>

                  {/* Com Units */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Commercial Units</label>
                    <input 
                      type="number"
                      value={formValues.com}
                      onChange={(e) => setFormValues({...formValues, com: e.target.value})}
                      className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.com ? 'border-red-400' : 'border-gray-250'}`}
                    />
                    {formErrors.com && <span className="text-red-500 text-[9px] font-bold">{formErrors.com}</span>}
                  </div>

                  {/* Amenity Units */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Amenity Units</label>
                    <input 
                      type="number"
                      value={formValues.amen}
                      onChange={(e) => setFormValues({...formValues, amen: e.target.value})}
                      className={`border px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none ${formErrors.amen ? 'border-red-400' : 'border-gray-250'}`}
                    />
                    {formErrors.amen && <span className="text-red-500 text-[9px] font-bold">{formErrors.amen}</span>}
                  </div>

                  {/* New Demand */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">New Demand (₹)</label>
                    <input 
                      type="text"
                      value={formValues.newDem}
                      onChange={(e) => setFormValues({...formValues, newDem: e.target.value})}
                      className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Retro Demand */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Retro Demand (₹)</label>
                    <input 
                      type="text"
                      value={formValues.retroDem}
                      onChange={(e) => setFormValues({...formValues, retroDem: e.target.value})}
                      className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Discount Amount */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Discount Amount</label>
                    <input 
                      type="text"
                      value={formValues.discount}
                      onChange={(e) => setFormValues({...formValues, discount: e.target.value})}
                      className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Discounted Units */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Discounted Units</label>
                    <input 
                      type="text"
                      value={formValues.discLabel}
                      onChange={(e) => setFormValues({...formValues, discLabel: e.target.value})}
                      className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Exempted Units */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Exempted Units</label>
                    <input 
                      type="text"
                      value={formValues.exemp}
                      onChange={(e) => setFormValues({...formValues, exemp: e.target.value})}
                      className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Exemption Type */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Exemption Type</label>
                    <input 
                      type="text"
                      value={formValues.exempLabel}
                      onChange={(e) => setFormValues({...formValues, exempLabel: e.target.value})}
                      className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* REV Impact */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">REV Impact</label>
                    <input 
                      type="text"
                      value={formValues.rvImpact}
                      onChange={(e) => setFormValues({...formValues, rvImpact: e.target.value})}
                      className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* REV Impact Percentage */}
                  <div className="flex flex-col gap-1">
                    <label className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">REV Impact %</label>
                    <input 
                      type="text"
                      value={formValues.rvLabel}
                      onChange={(e) => setFormValues({...formValues, rvLabel: e.target.value})}
                      className="border border-gray-250 px-3 py-1.5 rounded-lg text-gray-800 font-bold bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-150 mt-1">
                  <button 
                    type="button" 
                    onClick={() => setAddWingModalOpen(false)}
                    className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 font-bold transition cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#002fbe] hover:bg-[#002a8f] text-white rounded-lg font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : 'Save Wing'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* popupData details popover */}
      {popupData && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-30 bg-black/10 sm:bg-transparent" 
            onClick={() => setPopupData(null)}
          />
          
          <div 
            className="absolute z-40 w-[295px] bg-white border border-blue-200 rounded-xl shadow-xl p-3.5 font-sans animate-scaleIn select-none"
            style={{
              top: `${popupData.top}px`,
              left: `${popupData.left}px`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-150">
              <span className="font-black text-[#002fbe] text-[10px] uppercase tracking-wider">
                {popupData.type === 'discount' && `DISCOUNT DETAILS – ${popupData.wing.wing.toUpperCase()}`}
                {popupData.type === 'exemptions' && `EXEMPTION DETAILS – ${popupData.wing.wing.toUpperCase()}`}
                {popupData.type === 'rvImpact' && `REV IMPACT DETAILS – ${popupData.wing.wing.toUpperCase()}`}
              </span>
              <button 
                onClick={() => setPopupData(null)}
                className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-extrabold text-[12px] cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                ×
              </button>
            </div>

            {/* Details Content */}
            <div className="text-[10.5px] leading-relaxed space-y-2 text-gray-700 font-semibold">
              {popupData.type === 'discount' && (
                <>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Amount</span> <span className="text-[#002a8f] font-bold">{popupData.wing.discountDetails.amount}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Percentage</span> <span className="text-green-600 font-bold">{popupData.wing.discountDetails.pct}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Affected Units</span> <span className="text-gray-800 font-bold">{popupData.wing.discountDetails.units}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Category</span> <span className="text-gray-800 font-bold">{popupData.wing.discountDetails.category}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Applicable Period</span> <span className="text-gray-800">{popupData.wing.discountDetails.period}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Approval Status</span> <span className="text-green-600 font-bold">{popupData.wing.discountDetails.status}</span></div>
                  <div className="pt-1.5 border-t border-gray-100 text-gray-500 text-[9.5px] italic leading-tight">{popupData.wing.discountDetails.remarks}</div>
                </>
              )}

              {popupData.type === 'exemptions' && (
                <>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Exempted Units</span> <span className="text-gray-800 font-bold">{popupData.wing.exemptionDetails.units}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Category</span> <span className="text-purple-600 font-bold">{popupData.wing.exemptionDetails.category}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Eligible Units</span> <span className="text-gray-800">{popupData.wing.exemptionDetails.eligible}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Exemption Amount</span> <span className="text-[#002a8f] font-bold">{popupData.wing.exemptionDetails.amount}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Certificate No.</span> <span className="text-gray-800 font-bold">{popupData.wing.exemptionDetails.certNo}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Validity</span> <span className="text-gray-800">{popupData.wing.exemptionDetails.validity}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Status</span> <span className="text-green-600 font-bold">{popupData.wing.exemptionDetails.status}</span></div>
                  <div className="pt-1.5 border-t border-gray-100 text-gray-500 text-[9.5px] italic leading-tight">{popupData.wing.exemptionDetails.remarks}</div>
                </>
              )}

              {popupData.type === 'rvImpact' && (
                <>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Previous RV</span> <span className="text-gray-500 font-bold">{popupData.wing.rvImpactDetails.prevRv}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Revised RV</span> <span className="text-[#002a8f] font-bold">{popupData.wing.rvImpactDetails.revisedRv}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Difference RV</span> <span className="text-green-600 font-bold">{popupData.wing.rvImpactDetails.diff}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Percentage Change</span> <span className="text-green-600 font-bold">{popupData.wing.rvImpactDetails.pctChange}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Affected Units</span> <span className="text-gray-800 font-bold">{popupData.wing.rvImpactDetails.units}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Effective Date</span> <span className="text-gray-800">{popupData.wing.rvImpactDetails.effectiveDate}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 uppercase text-[8.5px]">Assessment Ref.</span> <span className="text-gray-800">{popupData.wing.rvImpactDetails.ref}</span></div>
                  <div className="pt-1.5 border-t border-gray-100 text-gray-500 text-[9.5px] italic leading-tight">{popupData.wing.rvImpactDetails.remarks}</div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Internal Components */

function Badge({ icon, label, val, color }: { icon: React.ReactNode; label: string; val: string; color: string }) {
  return (
    <div className={`flex flex-col bg-white border rounded-lg p-2 shadow-xs transition hover:shadow-sm ${color}`}>
      <span className="text-[9px] font-bold text-gray-400 leading-none">{label}</span>
      <div className="flex items-center gap-1 mt-1 leading-none">
        <span className="text-current">{icon}</span>
        <span className="text-[10px] font-black">{val}</span>
      </div>
    </div>
  );
}

function WingCard({ 
  wing, 
  activeMetric, 
  onMetricClick,
  onDeleteClick
}: { 
  wing: any; 
  activeMetric: 'discount' | 'exemptions' | 'rvImpact'; 
  onMetricClick: (e: React.MouseEvent<HTMLButtonElement>, wing: any, metricType: 'discount' | 'exemptions' | 'rvImpact') => void;
  onDeleteClick: (e: React.MouseEvent<HTMLButtonElement>, wingId: string) => void;
}) {
  const getSubMetricColor = (type: 'discount' | 'exemptions' | 'rvImpact') => {
    if (activeMetric === type) {
      if (type === 'discount' || type === 'rvImpact') return 'text-green-700 font-extrabold';
      return 'text-purple-700 font-extrabold';
    }
    if (wing.themeColor === 'purple') return 'text-purple-655 font-bold';
    if (wing.themeColor === 'orange') return 'text-orange-655 font-bold';
    if (type === 'discount' || type === 'rvImpact') return 'text-green-600 font-bold';
    return 'text-blue-650 font-bold';
  };

  const getSubMetricIconColor = (type: 'discount' | 'exemptions' | 'rvImpact') => {
    if (activeMetric === type) {
      if (type === 'discount' || type === 'rvImpact') return 'text-green-600';
      return 'text-purple-600';
    }
    if (wing.themeColor === 'purple') return 'text-purple-500';
    if (wing.themeColor === 'orange') return 'text-orange-500';
    if (type === 'discount' || type === 'rvImpact') return 'text-green-500';
    return 'text-blue-500';
  };

  const cardBorderAndShadow = () => {
    if (wing.themeColor === 'purple') return 'border-purple-100 hover:border-purple-300 hover:shadow-purple-50/40';
    if (wing.themeColor === 'orange') return 'border-orange-100 hover:border-orange-300 hover:shadow-orange-50/40';
    return 'border-green-100 hover:border-green-300 hover:shadow-green-50/40';
  };

  return (
    <div className={`bg-white border rounded-xl p-2.5 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between h-full min-h-[195px] select-none ${cardBorderAndShadow()}`}>
      {/* Top row */}
      <div className="flex items-center justify-between pb-0.5">
        <div className="flex items-center gap-1">
          <div className={`w-5 h-5 rounded flex items-center justify-center font-extrabold text-[8.5px] text-white ${wing.badgeBgColor}`}>
            {wing.wing[0]}
          </div>
          <div>
            <span className="text-[11.5px] font-black text-gray-800 block leading-tight">{wing.wing}</span>
            <span className="text-[8.5px] text-gray-500 font-semibold block leading-tight">{wing.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 select-none">
          <button 
            onClick={(e) => onDeleteClick(e, wing.id)}
            className="w-5 h-5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center cursor-pointer transition-colors focus:ring-1 focus:ring-red-400 outline-none"
            title={`Delete ${wing.wing}`}
            aria-label={`Delete ${wing.wing}`}
          >
            <Trash2 size={10.5} />
          </button>
          <div className={`w-6.5 h-6.5 rounded-full border-[1.5px] bg-white flex items-center justify-center font-black text-[9px] ${wing.gradeBorderColor}`}>
            {wing.grade}
          </div>
        </div>
      </div>

      {/* Floors and Units Row */}
      <div className="flex justify-between items-center text-[9px] font-bold text-gray-700 mt-1 px-0.5 select-none">
        <span>{wing.floors} Floors</span>
        <span>{wing.units} Units</span>
      </div>

      {/* Usage Categories Row */}
      <div className="bg-[#f8fafc] border-t border-b border-gray-150 py-1 px-1 my-1 flex divide-x divide-gray-200 rounded-md">
        <div className="flex items-center justify-center gap-1 flex-1 text-[8.5px] font-extrabold text-gray-700">
          <Home size={9} className="text-[#3b82f6] shrink-0" />
          <span>Res {wing.res}</span>
        </div>
        <div className="flex items-center justify-center gap-1 flex-1 text-[8.5px] font-extrabold text-gray-700 pl-0.5">
          <Briefcase size={9} className="text-[#f97316] shrink-0" />
          <span>Com {wing.com}</span>
        </div>
        <div className="flex items-center justify-center gap-1 flex-1 text-[8.5px] font-extrabold text-gray-700 pl-0.5">
          <ShieldCheck size={9} className="text-[#a855f7] shrink-0" />
          <span>Amen {wing.amen}</span>
        </div>
      </div>

      {/* Demands Grid */}
      <div className="grid grid-cols-2 divide-x divide-gray-150 py-0.5 my-1 text-center bg-gray-50/50 rounded-md border border-gray-100">
        <div className="pr-0.5 text-center flex flex-col justify-center">
          <span className="text-gray-500 font-semibold text-[8px] uppercase tracking-wider block">New Demand</span>
          <span className="font-extrabold text-[#1e2b58] text-[11px] mt-0.5 block">₹{wing.newDem}</span>
        </div>
        <div className="pl-0.5 text-center flex flex-col justify-center">
          <span className="text-gray-500 font-semibold text-[8px] uppercase tracking-wider block">Retro Demand</span>
          <span className="font-extrabold text-[#1e2b58] text-[11px] mt-0.5 block">₹{wing.retroDem}</span>
        </div>
      </div>

      {/* Bottom Metrics Row (Interactive Mini-Tabs) */}
      <div className="grid grid-cols-3 gap-0.5 border-t border-gray-100 pt-1.5 mt-1 text-[8px] leading-tight">
        {/* Discount */}
        <button 
          onClick={(e) => onMetricClick(e, wing, 'discount')}
          className={`flex flex-col items-center justify-center p-1 rounded-md border transition-all cursor-pointer focus:ring-1 focus:ring-blue-500 outline-none ${
            activeMetric === 'discount' 
              ? 'bg-green-50/90 border-green-300 text-green-700 shadow-xs border-b-2 border-b-green-500 font-extrabold' 
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50/60 hover:border-gray-250 font-bold'
          }`}
          aria-expanded={activeMetric === 'discount'}
          aria-label={`View ${wing.wing} Discount details`}
        >
          <div className="flex items-center gap-0.5">
            <Percent size={8} className={getSubMetricIconColor('discount')} />
            <span className="text-[7.5px] uppercase tracking-wider">Discount</span>
          </div>
          <span className="text-[10px] mt-0.5">{wing.discount}</span>
          <span className="text-[7.5px] text-gray-550 font-bold">({wing.discLabel})</span>
        </button>

        {/* Exemptions */}
        <button 
          onClick={(e) => onMetricClick(e, wing, 'exemptions')}
          className={`flex flex-col items-center justify-center p-1 rounded-md border transition-all cursor-pointer focus:ring-1 focus:ring-blue-500 outline-none ${
            activeMetric === 'exemptions' 
              ? 'bg-purple-50/90 border-purple-300 text-purple-700 shadow-xs border-b-2 border-b-purple-500 font-extrabold' 
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50/60 hover:border-gray-250 font-bold'
          }`}
          aria-expanded={activeMetric === 'exemptions'}
          aria-label={`View ${wing.wing} Exemptions details`}
        >
          <div className="flex items-center gap-0.5">
            <FileText size={8} className={getSubMetricIconColor('exemptions')} />
            <span className="text-[7.5px] uppercase tracking-wider">Exempt</span>
          </div>
          <span className="text-[10px] mt-0.5">{wing.exemp}</span>
          <span className="text-[7.5px] text-gray-550 font-bold truncate max-w-full" title={wing.exempLabel}>({wing.exempLabel})</span>
        </button>

        {/* REV Impact */}
        <button 
          onClick={(e) => onMetricClick(e, wing, 'rvImpact')}
          className={`flex flex-col items-center justify-center p-1 rounded-md border transition-all cursor-pointer focus:ring-1 focus:ring-blue-500 outline-none ${
            activeMetric === 'rvImpact' 
              ? 'bg-green-50/90 border-green-300 text-green-700 shadow-xs border-b-2 border-b-green-500 font-extrabold' 
              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50/60 hover:border-gray-250 font-bold'
          }`}
          aria-expanded={activeMetric === 'rvImpact'}
          aria-label={`View ${wing.wing} REV Impact details`}
        >
          <div className="flex items-center gap-0.5">
            <TrendingUp size={8} className={getSubMetricIconColor('rvImpact')} />
            <span className="text-[7.5px] uppercase tracking-wider">REV</span>
          </div>
          <span className="text-[10px] mt-0.5">{wing.rvImpact}</span>
          <span className="text-[7.5px] text-green-600 font-bold">({wing.rvLabel})</span>
        </button>
      </div>
    </div>
  );
}

function ProgressRow({ dotColor, label, val, pct }: { dotColor: string; label: string; val: string; pct: string }) {
  return (
    <div className="flex items-center justify-between text-[9px] font-bold text-gray-500 leading-none">
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-gray-800 font-extrabold">{val}</span>
        <span className="text-gray-400 text-[8px] font-medium">({pct})</span>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg cursor-pointer transition select-none ${
        active 
          ? 'bg-[#1e2b58] text-white' 
          : 'hover:bg-gray-100 text-gray-500'
      }`}
    >
      {label}
    </button>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 leading-none">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span>{label}</span>
    </div>
  );
}

function getStatusBgClass(status: string) {
  switch (status) {
    case 'Matched':
      return 'bg-green-50/70';
    case 'Modified':
      return 'bg-amber-50/70';
    case 'New':
      return 'bg-blue-50/75';
    case 'Missing':
      return 'bg-red-50/75';
    default:
      return '';
  }
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

function StatusBadge({ icon, title, status, statusColor, isBlue }: any) {
  const bgClass = isBlue ? 'bg-blue-50 text-blue-650' : 'bg-green-50 text-green-650';
  return (
    <div className="flex items-center gap-2 pr-4 border-r border-gray-200 last:border-0 last:pr-0 shrink-0 flex-1 justify-center">
      <div className={`p-1.5 rounded-full flex items-center justify-center ${bgClass} w-7 h-7`}>
        {icon}
      </div>
      <div>
        <div className="text-[9px] text-[#002fbe] font-bold leading-none">{title}</div>
        <div className={`text-[9.5px] font-extrabold mt-0.5 leading-none ${statusColor || 'text-green-600'}`}>{status}</div>
      </div>
    </div>
  );
}

function MapBox({ title, imgUrl, onZoom, onHover }: any) {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col group shadow-xs hover:shadow-md hover:border-blue-500 transition-all cursor-pointer transform hover:-translate-y-0.5"
      onClick={onZoom}
      onMouseEnter={() => onHover && onHover(imgUrl)}
      onMouseLeave={() => onHover && onHover(null)}
      role="button"
      aria-label={`Open ${title} preview`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          onZoom();
        }
      }}
    >
      <div className="px-2.5 py-1 font-black text-[#1e2b58] text-[9.5px] bg-gray-50 border-b border-gray-150 uppercase tracking-wider flex justify-between items-center select-none">
        <span>{title}</span>
        <Maximize2 size={10} className="text-gray-400 group-hover:text-[#002fbe] transition-colors" />
      </div>
      <div className="w-full h-[105px] bg-gray-200 relative overflow-hidden">
        <img
          src={imgUrl}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          alt={title}
        />
        <div className="absolute top-1.5 right-1.5 bg-white/90 p-0.5 rounded shadow-sm">
          <MapPin size={11} className="text-red-600" />
        </div>
      </div>
    </div>
  );
}

function ChangeDetectionBox({ title, beforeImg, afterImg, beforeImgZoom, afterImgZoom, onHover, onZoom, isEnlarged }: any) {
  const [sliderPos, setSliderPos] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEnlarged) return; // Disable hover zoom in popup
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    if (percentage < sliderPos) {
      onHover(afterImgZoom);
    } else {
      onHover(beforeImgZoom);
    }
  };

  const handleMouseLeave = () => {
    if (isEnlarged) return;
    onHover(null);
  };

  return (
    <div 
      className={`bg-white border rounded-xl overflow-hidden flex flex-col group transition-all relative ${
        isEnlarged 
          ? 'border-gray-200 w-full h-full animate-scaleIn' 
          : 'border-gray-200 hover:border-blue-500 hover:shadow-md cursor-pointer transform hover:-translate-y-0.5 shadow-xs'
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isEnlarged ? undefined : onZoom}
      role={isEnlarged ? undefined : "button"}
      aria-label={isEnlarged ? undefined : "Open Change Detection preview"}
      tabIndex={isEnlarged ? undefined : 0}
      onKeyDown={(e) => {
        if (!isEnlarged && (e.key === ' ' || e.key === 'Enter')) {
          onZoom();
        }
      }}
    >
      <div className="px-2.5 py-1 font-black text-[#1e2b58] text-[9.5px] bg-gray-50 border-b border-gray-150 uppercase tracking-wider flex justify-between items-center select-none">
        <span>{title}</span>
        {!isEnlarged ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[7.5px] bg-blue-50 text-blue-600 px-1 py-0.25 rounded font-normal">Drag to compare</span>
            <Maximize2 size={10} className="text-gray-400 group-hover:text-[#002fbe] transition-colors" />
          </div>
        ) : (
          <span className="text-[8px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">Use slider below to compare</span>
        )}
      </div>

      <div className={`w-full relative overflow-hidden select-none bg-gray-100 ${isEnlarged ? 'flex-1 min-h-0' : 'h-[105px]'}`}>
        {/* Before Image */}
        <img
          src={beforeImg}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          alt="Before"
        />

        {/* After Image Overlay */}
        <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none" style={{ width: `${sliderPos}%` }}>
          <img
            src={afterImg}
            className="absolute inset-0 object-cover max-w-none pointer-events-none"
            style={{ width: isEnlarged ? '600px' : '268px', height: '100%' }}
            alt="After"
          />
        </div>

        {/* Labels */}
        <div className="absolute bottom-1.5 left-1.5 bg-[#3b82f6]/95 text-[7px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider">
          After (2024)
        </div>
        <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-[7px] font-bold text-white px-1 py-0.5 rounded z-20 pointer-events-none uppercase tracking-wider">
          Before (2023)
        </div>

        {/* Vertical divider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border border-gray-300 shadow flex items-center justify-center text-[8px] font-bold text-gray-500 pointer-events-none">
            ↔
          </div>
        </div>

        {/* Range slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          onClick={(e) => e.stopPropagation()} // Stop click propagation to prevent opening lightbox on drag
        />
      </div>
    </div>
  );
}
