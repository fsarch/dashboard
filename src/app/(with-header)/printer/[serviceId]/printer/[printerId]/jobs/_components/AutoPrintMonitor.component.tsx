'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { useLocalPrinter } from "./LocalPrinter.context";
import { PrintJobDto } from "@/services/printer/printer.type";
import { executeAutoPrintJob } from "./LocalPrinter.utils";

type AutoPrintMonitorProps = {
  printerId: string;
  jobs: PrintJobDto[];
};

const AutoPrintMonitor: React.FunctionComponent<AutoPrintMonitorProps> = ({
  printerId,
  jobs,
}) => {
  const localPrinter = useLocalPrinter();
  const router = useRouter();
  const processedJobsRef = useRef<Set<string>>(new Set());

  const processNewJobs = useCallback(async () => {
    if (!localPrinter?.autoPrint || !localPrinter.printer) {
      return;
    }

    // Find new jobs that haven't been processed yet
    const newJobs = jobs.filter(job =>
      !processedJobsRef.current.has(job.id) &&
      !job.printTime && // Not yet printed
      job.data // Has printable data
    );

    for (const job of newJobs) {
      try {
        if (processedJobsRef.current.has(job.id)) {
          continue;
        }

        console.log(`Auto-printing job ${job.id}...`);
        await executeAutoPrintJob(localPrinter, job);
        processedJobsRef.current.add(job.id);

        // Refresh to show updated job status
        router.refresh();
      } catch (error) {
        console.error(`Failed to auto-print job ${job.id}:`, error);
        // Mark as processed to avoid infinite retry
        processedJobsRef.current.add(job.id);
      }
    }
  }, [localPrinter, jobs, router]);

  // Monitor for new jobs when auto-print is enabled
  useEffect(() => {
    if (!localPrinter?.autoPrint) {
      // Clear processed jobs when auto-print is disabled
      processedJobsRef.current.clear();
      return;
    }

    processNewJobs();
  }, [localPrinter?.autoPrint, jobs, processNewJobs]);

  // Clean up processed jobs list periodically to prevent memory leaks
  useEffect(() => {
    const cleanup = setInterval(() => {
      const currentJobIds = new Set(jobs.map(job => job.id));
      processedJobsRef.current = new Set(
        Array.from(processedJobsRef.current).filter(id => currentJobIds.has(id))
      );
    }, 60_000); // Clean up every minute

    return () => clearInterval(cleanup);
  }, [jobs]);

  return null; // This component doesn't render anything
};

export default AutoPrintMonitor;
