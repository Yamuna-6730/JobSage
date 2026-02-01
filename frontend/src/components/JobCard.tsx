import { ArrowUpRight, MapPin, Building2, Wallet } from "lucide-react";
import { Job } from "@/lib/api";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="card-brutalist bg-white border border-black rounded-[45px]
      h-[320px] p-6 flex flex-col justify-between"
    >
      {/* Top content */}
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="pr-2">
            <h3 className="text-xl font-bold text-black line-clamp-2">
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium flex items-center gap-2 mt-1">
              <Building2 size={16} /> {job.company}
            </p>
          </div>

          {job.match_score && (
            <span className="bg-[#B9FF66] border border-black text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
              {job.match_score}% Match
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 my-3 text-sm text-black">
          <span className="flex items-center gap-1 border border-black px-2 py-1 rounded-md bg-white">
            <MapPin size={14} /> {job.location}
          </span>

          {job.salary_or_stipend && (
            <span className="flex items-center gap-1 border border-black px-2 py-1 rounded-md bg-white">
              <Wallet size={14} /> {job.salary_or_stipend}
            </span>
          )}

          <span className="flex items-center gap-1 border border-black px-2 py-1 rounded-md bg-white uppercase text-xs font-bold">
            {job.source}
          </span>
        </div>

        {/* Reasoning (clamped) */}
        {job.match_reasoning && (
          <div className="text-sm text-gray-700 italic border-l-4 border-[#B9FF66] pl-3 line-clamp-2">
            "{job.match_reasoning}"
          </div>
        )}
      </div>

      {/* CTA pinned to bottom */}
      <a
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-2 w-full justify-center
          bg-black hover:bg-black/80 text-white font-semibold
          py-3 px-4 rounded-xl transition-all"
      >
        Apply Now <ArrowUpRight size={16} />
      </a>
    </div>
  );
}