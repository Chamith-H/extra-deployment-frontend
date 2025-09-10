import PageTitle from "../../shared/common/PageTitle";
import "../../../styles/content/dashboard/Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { get_dashboardData } from "../../../services/controllers/dashboard.controller";
import ContentLoader from "../../shared/common/ContentLoader";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import GoogleMapReact from "google-map-react";
import { get_userDrop } from "../../../services/controllers/user.controller";
import FormDropdown from "../../shared/inputs/FormDropdown";
import LongSideModal from "../../shared/common/LongSideModal";
import ViewJob from "../schedules/imports/ViewJob";

const localizer = momentLocalizer(moment);

export default function Dashboard() {
  const [loadingDashboard, setLoadingDashbord] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  // Example data (replace with your actual list)
  const [inputs, setInputs] = useState({
    user: "All",
    ack: true,
    chk: true,
  });

  const [locations, setLocations] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const [showView, setShowView] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const clickedJob = (jobId: string) => {
    const job = jobs.find((j: any) => j.JobID === jobId);
    setSelectedData(job);
    setShowView(true);
  };

  // Marker component for map
  const MarkerComponent = ({ text, color }: any) => (
    <div
      onClick={() => clickedJob(text)}
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        whiteSpace: "nowrap",
      }}
    >
      <i
        style={{ color: color, fontSize: "20px" }}
        className="bi bi-geo-alt-fill"
      ></i>
      <p
        style={{ color: "white", fontSize: "12px", marginLeft: "1px" }}
        className="mb-0"
      >
        {text}
      </p>
    </div>
  );

  const ackChkChecker = (upcomingLocations: any[]) => {
    if (upcomingLocations.length === 0) {
      return [];
    } else {
      if (!inputs.ack && !inputs.chk) {
        return [];
      } else if (inputs.ack && !inputs.chk) {
        const wantedLocations = upcomingLocations.filter(
          (u_loc: any) => u_loc.target === "Ack"
        );

        return wantedLocations;
      } else if (!inputs.ack && inputs.chk) {
        const wantedLocations = upcomingLocations.filter(
          (u_loc: any) => u_loc.target === "Chk"
        );

        return wantedLocations;
      } else {
        return upcomingLocations;
      }
    }
  };

  const fetchLocations = () => {
    if (locations && locations.length !== 0) {
      if (inputs.user === "All") {
        return ackChkChecker(locations);
      } else {
        const userLocations = locations.filter(
          (loc: any) => loc.user === inputs.user
        );

        return ackChkChecker(userLocations);
      }
    } else {
      return [];
    }
  };

  // Center the map to Sri Lanka
  const defaultProps = {
    center: {
      lat: 6.9144537,
      lng: 79.9222454,
    },
    zoom: 10,
  };

  // Convert jobs to calendar events
  const events = useMemo(
    () =>
      jobs.map((job) => ({
        id: job.id,
        jobId: job.JobID,
        title: `${job.Subject} - ${job.Customer} -> ${job.JobID}`,
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
        fontSize: "12px",
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
      console.log(response.openJobs);

      let f_locations: any[] = [];

      const fetchedLocations = response.openJobs.map((o_job: any) => {
        if (o_job.AcknowledgementLat !== "") {
          if (
            o_job.AcknowledgementLat &&
            o_job.AcknowledgementLat !== "" &&
            o_job.AcknowledgementLong &&
            o_job.AcknowledgementLong !== ""
          ) {
            const location = {
              lat: Number(o_job.AcknowledgementLat),
              lng: Number(o_job.AcknowledgementLong),
              color: "#00bb00",
              name: o_job.JobID,
              target: "Ack",
              user: `${o_job.Technician}`,
            };

            f_locations.push(location);
          }
        }

        if (o_job.CheckedInLat !== "") {
          if (
            o_job.CheckedInLat &&
            o_job.CheckedInLat !== "" &&
            o_job.CheckedInLong &&
            o_job.CheckedInLong !== ""
          ) {
            const location = {
              lat: Number(o_job.CheckedInLat),
              lng: Number(o_job.CheckedInLong),
              color: "orange",
              name: o_job.JobID,
              target: "Chk",
              user: `${o_job.Technician}`,
            };

            console.log(o_job, "Locs");

            f_locations.push(location);
          }
        }

        return o_job;
      });

      if (fetchedLocations) {
        setLocations(f_locations);
      }
    }
    setLoadingDashbord(false);
  };

  const getUsers = async () => {
    setLoadingUsers(true);
    const userList = await get_userDrop();
    setUsers(userList);
    setLoadingUsers(false);
  };

  useEffect(() => {
    getDashData();
    getUsers();
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
          {[1, 2, 3, 4].map((i) => (
            <div className="col-3" key={i}>
              <ContentLoader />
            </div>
          ))}
        </div>
      )}

      {!loadingDashboard && responseData && (
        <div>
          {/* Top Counts */}
          <div className="row mt-3 gx-3">
            {[
              {
                label: "Total Technicians",
                value: counts.users,
                img: "engineer.png",
              },
              { label: "Total Jobs", value: counts.jobs, img: "job.png" },
              {
                label: "Total Journeys",
                value: counts.journeys,
                img: "journeys.png",
              },
              {
                label: "Total Expenses",
                value: counts.expenses,
                img: "financial.png",
              },
            ].map((card, i) => (
              <div className="col-3" key={i}>
                <div className="Dash-Card px-3 py-3">
                  <div>
                    <p className="mb-0">{card.label}</p>
                    <h6 className="mb-0">{card.value}</h6>
                  </div>
                  <div className="dash-img">
                    <img src={`/images/dashboard/${card.img}`} alt="" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Job Status Pie + Calendar */}
          <div className="row mt-0 gx-3 gy-3">
            <div className="col-6">
              <div className="Pie-Card py-4 px-3">
                <div className="Card-Intro mb-3">
                  <p className="mb-0">Job Statuses</p>
                </div>
                <PieChart width={400} height={450}>
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
                    wrapperStyle={{ fontSize: "13px", fontFamily: "R3" }}
                    formatter={(value) => (
                      <span style={{ color: "#6e6e6eff" }}>{value}</span>
                    )}
                  />
                </PieChart>
              </div>
            </div>

            <div className="col-6">
              <div className="Calendar-Card pt-4 pb-3 px-3">
                <div className="Card-Intro d-flex justify-content-between mb-3">
                  <p className="mb-0">Job Priorities</p>
                  <h6 className="mb-0">{moment().format("MMMM - YYYY")}</h6>
                </div>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="month"
                  eventPropGetter={eventStyleGetter}
                  toolbar={false}
                  popup
                  style={{ height: 455 }}
                  onSelectEvent={(event: any) => clickedJob(event.jobId)}
                />
              </div>
            </div>

            {/* Google Map */}
            <div className="col-12">
              <div className="Calendar-Card pt-4 pb-3 px-3">
                <div className="Card-Intro mb-3">
                  <p className="mb-0">Job Locations</p>
                </div>

                <div>
                  <div className="row">
                    <div className="col-6">
                      <FormDropdown
                        label="User / Technician"
                        mandatory={!true}
                        value={inputs.user}
                        options={users}
                        onChange={(option: any) =>
                          setInputs({ ...inputs, user: option.value })
                        }
                        submitted={true}
                        loading={loadingUsers}
                        disabled={loadingUsers}
                        error=""
                      />
                    </div>

                    <div className="col-6 d-flex align-items-center justify-content-end">
                      <div className="d-flex align-items-center dash-check">
                        <input
                          id="ackID"
                          type="checkbox"
                          checked={inputs.ack}
                          onChange={() =>
                            setInputs({ ...inputs, ack: !inputs.ack })
                          }
                        />
                        <p className="mb-0">
                          Acknowledgement&nbsp;
                          <i
                            style={{ color: "#00bb00" }}
                            className="bi bi-geo-alt-fill"
                          ></i>
                        </p>
                      </div>

                      <div className="d-flex align-items-center dash-check ms-4">
                        <input
                          id="chkID"
                          type="checkbox"
                          checked={inputs.chk}
                          onChange={() =>
                            setInputs({ ...inputs, chk: !inputs.chk })
                          }
                        />
                        <p className="mb-0">
                          Checked-In&nbsp;
                          <i
                            style={{ color: "orange" }}
                            className="bi bi-geo-alt-fill"
                          ></i>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ height: "500px", width: "100%" }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: "AIzaSyCqbN5FMGKUGR9MUiWgIaLNUwT0VxNswV0", // 🔑 replace with env variable
                    }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                  >
                    {fetchLocations().map((loc, index) => (
                      <MarkerComponent
                        key={index}
                        lat={loc?.lat}
                        lng={loc?.lng}
                        text={loc.name}
                        color={loc.color}
                      />
                    ))}
                  </GoogleMapReact>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <LongSideModal
        visible={showView}
        title="JOB DETAILS"
        image="job.png"
        closeModal={() => setShowView(false)}
        content={<ViewJob dataObj={selectedData} />}
      />
    </div>
  );
}
