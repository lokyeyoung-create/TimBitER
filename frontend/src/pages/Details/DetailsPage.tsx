import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDrugDetails } from "../../api/externalApi";
import ReviewSection from "./ReviewSection";

const DetailsPage: React.FC = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if (!id) return;
    const load = async ()=>{
      setLoading(true);
      const details = await getDrugDetails(decodeURIComponent(id));
      setItem(details);
      setLoading(false);
    };
    load();
  }, [id]);

  if (!id) return <div className="p-8">No item specified</div>;

  return (
    <div className="p-8">
      {loading && <div>Loading details...</div>}
      {!loading && item && (
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">{(item.openfda && (item.openfda.brand_name || item.openfda.generic_name)) || item._id}</h1>
          <div className="bg-white p-5 rounded shadow-sm">
            <h3 className="font-medium mb-2">Summary</h3>
            <p className="text-sm text-secondaryText">{(item.indications_and_usage && item.indications_and_usage[0]) || (item.purpose && item.purpose[0]) || 'No summary available.'}</p>
            <div className="mt-4">
              <h4 className="font-medium">Adverse Reactions</h4>
              <p className="text-sm text-secondaryText">{(item.adverse_reactions && item.adverse_reactions[0]) || 'Not available'}</p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Warnings</h4>
              <p className="text-sm text-secondaryText">{(item.warnings && item.warnings[0]) || 'Not available'}</p>
            </div>
          </div>

          <ReviewSection itemId={decodeURIComponent(id)} />
        </div>
      )}

      {!loading && !item && (
        <div>No details found for this item.</div>
      )}
    </div>
  );
};

export default DetailsPage;
