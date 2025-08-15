import PageTitle from "../../shared/common/PageTitle";
import "../../../styles/content/dashboard/Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { get_dashboardData } from "../../../services/controllers/dashboard.controller";
import ContentLoader from "../../shared/common/ContentLoader";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function Dashboard() {
  const [loadingDashboard, setLoadingDashbord] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);

  const [jobs, setJobs] = useState<any[]>([]);

  // Convert jobs to calendar events
  const events = useMemo(
    () =>
      jobs.map((job) => ({
        id: job.id,
        title: `${job.Subject} - ${job.Customer}`,
        start: new Date(job.PlannedStartDateTime),
        end: new Date(job.PlannedEndDateTime),
        priority: job.Priority,
      })),
    [jobs]
  );

  // Style events by priority
  const eventStyleGetter = (event: any) => {
    let backgroundColor = "";
    if (event.priority === "Low") backgroundColor = "green";
    if (event.priority === "Medium") backgroundColor = "orange";
    if (event.priority === "High") backgroundColor = "red";

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const [counts, setCounts] = useState({
    users: 0,
    journeys: 0,
    jobs: 0,
    expenses: 0,
  });

  const [jobProgress, setJobProgress] = useState({
    Open: 12,
    Accepted: 21,
    CheckedIN: 52,
    InProgress: 70,
    Hold: 3,
    Completed: 7,
    Checkout: 14,
  });

  const getDashData = async () => {
    setLoadingDashbord(true);

    const response = await get_dashboardData();

    if (response) {
      setResponseData(response);

      setCounts(response.counts);
      setJobProgress(response.statuses);
      setJobs(response.openJobs);

      setLoadingDashbord(false);
    }
  };

  useEffect(() => {
    getDashData();
  }, []);

  // Convert object to array format
  const data = Object.entries(jobProgress).map(([name, value]) => ({
    name,
    value,
  }));

  // Define custom colors for each slice
  const COLORS = [
    "red", // Open
    "#00bb00", // Accepted
    "#ff8800ff", // CheckedIN
    "#00a2ff", // InProgress
    "#617bb4", // Hold
    "green", // Completed
    "#6e00ec", // Checkout
  ];

  return (
    <div>
      <PageTitle
        title="DASHBOARD"
        module="Home"
        section="Dashboard"
        actionName="NONE"
      />

      {loadingDashboard && (
        <div className="row overflow-hidden">
          <div className="col-3">
            <ContentLoader />
          </div>

          <div className="col-3">
            <ContentLoader />
          </div>

          <div className="col-3">
            <ContentLoader />
          </div>

          <div className="col-3">
            <ContentLoader />
          </div>
        </div>
      )}

      {!loadingDashboard && responseData && (
        <div>
          <div className="row mt-3 gx-3">
            <div className="col-3">
              <div className="Dash-Card px-3 py-3">
                <div>
                  <p className="mb-0">Total Technicians</p>
                  <h6 className="mb-0">{counts.users}</h6>
                </div>

                <div className="dash-img">
                  <img src="/images/dashboard/engineer.png" alt="" />
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="Dash-Card px-3 py-3">
                <div>
                  <p className="mb-0">Total Jobs</p>
                  <h6 className="mb-0">{counts.jobs}</h6>
                </div>

                <div className="dash-img">
                  <img src="/images/dashboard/job.png" alt="" />
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="Dash-Card px-3 py-3">
                <div>
                  <p className="mb-0">Total Journeys</p>
                  <h6 className="mb-0">{counts.journeys}</h6>
                </div>

                <div className="dash-img">
                  <img src="/images/dashboard/journeys.png" alt="" />
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="Dash-Card px-3 py-3">
                <div>
                  <p className="mb-0">Total Expenses</p>
                  <h6 className="mb-0">{counts.expenses}</h6>
                </div>

                <div className="dash-img">
                  <img src="/images/dashboard/financial.png" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3 gx-3">
            <div className="col-6">
              <div className="Pie-Card py-4 px-3">
                <div className="Card-Intro mb-3">
                  <p className="mb-0">Job Statuses</p>
                </div>

                <PieChart width={400} height={400}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    wrapperStyle={{
                      fontSize: "13px",
                      fontFamily: "R3",
                    }}
                    formatter={(value) => (
                      <span style={{ color: "#6e6e6eff" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </div>
            </div>

            <div className="col-6">
              {/* <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="month"
                eventPropGetter={eventStyleGetter}
                popup
              /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
