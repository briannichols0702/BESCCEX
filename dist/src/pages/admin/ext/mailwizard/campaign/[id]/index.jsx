"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("@iconify/react");
const Default_1 = __importDefault(require("@/layouts/Default"));
const router_1 = require("next/router");
const api_1 = __importDefault(require("@/utils/api"));
const BackButton_1 = require("@/components/elements/base/button/BackButton");
const Button_1 = __importDefault(require("@/components/elements/base/button/Button"));
const Card_1 = __importDefault(require("@/components/elements/base/card/Card"));
const IconBox_1 = __importDefault(require("@/components/elements/base/iconbox/IconBox"));
const Modal_1 = __importDefault(require("@/components/elements/base/modal/Modal"));
const infoBlock_1 = __importDefault(require("@/components/elements/base/infoBlock"));
const Avatar_1 = __importDefault(require("@/components/elements/base/avatar/Avatar"));
const Checkbox_1 = __importDefault(require("@/components/elements/form/checkbox/Checkbox"));
const IconButton_1 = __importDefault(require("@/components/elements/base/button-icon/IconButton"));
const Input_1 = __importDefault(require("@/components/elements/form/input/Input"));
const Pagination_1 = __importDefault(require("@/components/elements/base/pagination/Pagination"));
const DealCard_1 = require("@/components/pages/p2p/DealCard");
const ObjectTable_1 = require("@/components/elements/base/object-table/ObjectTable");
const Tag_1 = __importDefault(require("@/components/elements/base/tag/Tag"));
const next_i18next_1 = require("next-i18next");
const CampaignStatus = {
    PENDING: "warning",
    ACTIVE: "primary",
    PAUSED: "info",
    COMPLETED: "success",
    CANCELLED: "danger",
    STOPPED: "danger",
};
const statusText = (status) => {
    const texts = {
        PENDING: "Pending",
        ACTIVE: "Active",
        PAUSED: "Paused",
        COMPLETED: "Completed",
        CANCELLED: "Canceled",
        STOPPED: "Stopped",
    };
    return texts[status] || "Pending";
};
const targetsColumnConfig = [
    {
        field: "email",
        label: "Email",
        type: "text",
        sortable: true,
        getValue: (row) => (<div className="flex items-center gap-2">
        <Avatar_1.default size="xs" src={row.avatar || "/img/avatars/placeholder.webp"}/>
        <div className="flex flex-col">
          <span className="text-md">{row.email}</span>
          <span className="text-sm text-muted-500 dark:text-muted-400">
            {row.firstName} {row.lastName}
          </span>
        </div>
      </div>),
    },
    {
        field: "status",
        label: "Status",
        type: "text",
        sortable: true,
        getValue: (row) => (<Tag_1.default color={CampaignStatus[row.status]} variant={"pastel"}>
        {statusText(row.status)}
      </Tag_1.default>),
    },
];
const CampaignDetails = () => {
    const { t } = (0, next_i18next_1.useTranslation)();
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [campaign, setCampaign] = (0, react_1.useState)(null);
    const [items, setItems] = (0, react_1.useState)([]);
    const [open, setOpen] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [users, setUsers] = (0, react_1.useState)([]);
    const [selectedUsers, setSelectedUsers] = (0, react_1.useState)([]);
    const [userFilter, setUserSearch] = (0, react_1.useState)("");
    const [totalUsersInDatabase, setTotalUsersInDatabase] = (0, react_1.useState)(0);
    const [userPagination, setUserPagination] = (0, react_1.useState)({
        totalItems: 0,
        totalPages: 0,
        perPage: 20,
        currentPage: 1,
    });
    const fetchCampaign = async () => {
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/ext/mailwizard/campaign/${id}`,
            silent: true,
        });
        if (!error) {
            setCampaign(data);
            let targets = [];
            try {
                targets = JSON.parse(data.targets);
            }
            catch (error) {
                targets = [];
            }
            if (targets) {
                setItems(targets);
            }
        }
    };
    (0, react_1.useEffect)(() => {
        if (id) {
            fetchCampaign();
        }
    }, [id]);
    const updateCampaignStatus = async (status) => {
        const { error } = await (0, api_1.default)({
            url: `/api/admin/ext/mailwizard/campaign/${id}/status`,
            method: "PUT",
            body: { status },
        });
        if (!error) {
            await fetchCampaign();
        }
    };
    const handleUpdateStatus = (status) => {
        updateCampaignStatus(status);
    };
    const fetchUsers = async (filter = "", page = 1, perPage = 10, fetchAll = false) => {
        const filterObject = {
            firstName: { value: filter, operator: "startsWith" },
        };
        const { data, error } = await (0, api_1.default)({
            url: `/api/admin/crm/user`,
            params: fetchAll
                ? { all: "true" }
                : { filter: JSON.stringify(filterObject), page, perPage },
            silent: true,
        });
        if (!error) {
            if (fetchAll) {
                setUsers(data.data); // Fetch all users directly when `all=true`
                setSelectedUsers(data.data); // Set all as selected
                setTotalUsersInDatabase(data.data.length); // Update total user count
            }
            else {
                setUsers(data.items); // Handle paginated users
                setUserPagination(data.pagination); // Update pagination state
                setTotalUsersInDatabase(data.pagination.totalItems); // Update total user count
            }
        }
    };
    const handleAddAllUsers = async () => {
        setIsLoading(true);
        try {
            await fetchUsers("", 1, 10, true); // Fetch all users
            setSelectedUsers((prev) => [...prev, ...users]); // Add all fetched users to the selected list
        }
        catch (error) {
            console.error("Failed to fetch all users:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        if (open) {
            fetchUsers(userFilter, userPagination.currentPage, userPagination.perPage);
        }
    }, [userFilter, userPagination.currentPage, userPagination.perPage, open]);
    (0, react_1.useEffect)(() => {
        if (campaign && campaign.targets && open) {
            const existingTargetIds = items.map((item) => item.id);
            setSelectedUsers(users.filter((user) => existingTargetIds.includes(user.id)));
        }
    }, [campaign, items, users, open]);
    const handleSelectUser = (user) => {
        setSelectedUsers((prev) => {
            if (prev.some((u) => u.id === user.id)) {
                return prev.filter((u) => u.id !== user.id);
            }
            else {
                return [...prev, user];
            }
        });
    };
    const handleAddUsers = async () => {
        if (selectedUsers.length === items.length) {
            setOpen(false);
            return;
        }
        setIsLoading(true);
        let targets = [];
        try {
            targets = JSON.parse(campaign.targets) || [];
        }
        catch (error) {
            targets = [];
        }
        const targetMap = new Map(targets.map((target) => [target.id, target]));
        selectedUsers.forEach((user) => {
            if (targetMap.has(user.id)) {
                // Preserve existing status
                const existingTarget = targetMap.get(user.id);
                targetMap.set(user.id, {
                    ...existingTarget,
                    avatar: user.avatar,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
            }
            else {
                // Add new user with status "PENDING"
                targetMap.set(user.id, {
                    id: user.id,
                    avatar: user.avatar,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    status: "PENDING",
                });
            }
        });
        const updatedTargets = Array.from(targetMap.values()).filter((target) => selectedUsers.some((user) => user.id === target.id));
        const { error } = await (0, api_1.default)({
            url: `/api/admin/ext/mailwizard/campaign/${id}/target`,
            method: "PUT",
            body: {
                targets: JSON.stringify(updatedTargets),
            },
        });
        if (!error) {
            setOpen(false);
            setItems(updatedTargets);
        }
        setIsLoading(false);
    };
    if (!campaign) {
        return (<div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <react_2.Icon icon="mdi:loading" className="h-12 w-12 animate-spin text-primary-500"/>
          <p className="text-xl text-primary-500">{t("Loading Campaign...")}</p>
        </div>
      </div>);
    }
    return (<Default_1.default title={t("View Mailwizard Campaign")} color="muted">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-muted-700 dark:text-white">
          {campaign.name} {t("Campaign")}
        </h2>
        <BackButton_1.BackButton href="/admin/ext/mailwizard/campaign"/>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-1">
          <Card_1.default className="p-3 mb-5">
            <div className="flex items-center justify-between gap-3 flex-col">
              <div className="flex items-center gap-3 w-full">
                <div className="w-full">
                  <Button_1.default type="button" color="success" className="w-full" onClick={() => handleUpdateStatus("ACTIVE")} disabled={["ACTIVE", "COMPLETED", "CANCELLED"].includes(campaign.status)}>
                    <react_2.Icon icon="line-md:play" className="h-4 w-4 mr-2"/>
                    {t("Start")}
                  </Button_1.default>
                </div>
                <div className="w-full">
                  <Button_1.default type="button" color="warning" className="w-full" onClick={() => handleUpdateStatus("PAUSED")} disabled={[
            "PENDING",
            "STOPPED",
            "PAUSED",
            "COMPLETED",
            "CANCELLED",
        ].includes(campaign.status)}>
                    <react_2.Icon icon="line-md:pause" className="h-4 w-4 mr-2"/>
                    {t("Pause")}
                  </Button_1.default>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full">
                <div className="w-full">
                  <Button_1.default type="button" color="danger" className="w-full" onClick={() => handleUpdateStatus("STOPPED")} disabled={[
            "PENDING",
            "COMPLETED",
            "CANCELLED",
            "STOPPED",
        ].includes(campaign.status)}>
                    <react_2.Icon icon="mdi:stop" className="h-4 w-4 mr-2"/>
                    {t("Stop")}
                  </Button_1.default>
                </div>
                <div className="w-full">
                  <Button_1.default type="button" color="danger" className="w-full" onClick={() => handleUpdateStatus("CANCELLED")} disabled={[
            "ACTIVE",
            "PAUSED",
            "COMPLETED",
            "CANCELLED",
        ].includes(campaign.status)}>
                    <react_2.Icon icon="line-md:close" className="h-4 w-4 mr-2"/>
                    {t("Cancel")}
                  </Button_1.default>
                </div>
              </div>
            </div>
          </Card_1.default>

          <DealCard_1.DealCard isToggle title={t("Campaign Details")}>
            <infoBlock_1.default icon="bx:bx-tag" label={t("Name")} value={campaign.name}/>
            <infoBlock_1.default icon="bx:bx-envelope" label={t("Subject")} value={campaign.subject}/>
            <infoBlock_1.default icon="bx:bx-tachometer" label={t("Speed")} value={campaign.speed}/>
            <infoBlock_1.default icon="bx:bx-template" label={t("Template")} value={campaign.template.name}/>
            <infoBlock_1.default icon="bx:bx-info-circle" label={t("Status")} value={<span className={`text-${CampaignStatus[campaign.status]}-500`}>
                  {statusText(campaign.status)}
                </span>}/>
            <infoBlock_1.default icon="bx:bx-calendar" label={t("Created At")} value={new Date(campaign.createdAt).toLocaleDateString()}/>
          </DealCard_1.DealCard>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <ObjectTable_1.ObjectTable title={t("Targets")} items={items} setItems={setItems} columnConfig={targetsColumnConfig} navSlot={<IconBox_1.default color="primary" onClick={() => setOpen(true)} size={"sm"} shape={"rounded-sm"} variant={"pastel"} className="cursor-pointer hover:shadow-sm transition-all duration-300 ease-in-out hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 hover:bg-primary-500 hover:text-muted-100" icon="mdi:plus"/>} shape="rounded-sm" size="sm" filterField="email"/>
        </div>
      </div>

      <Modal_1.default open={open} size="lg">
        <Card_1.default shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Target Selection")}
            </p>
            <IconButton_1.default size="sm" shape="full" onClick={() => setOpen(false)}>
              <react_2.Icon icon="lucide:x" className="h-4 w-4"/>
            </IconButton_1.default>
          </div>
          <div className="p-4 md:px-6 md:py-8">
            <div className="mx-auto w-full">
              <p className="text-sm text-muted-500 dark:text-muted-400">
                {t("Add new target to the campaign")}
              </p>

              <Input_1.default value={userFilter} onChange={(e) => setUserSearch(e.target.value)} icon="lucide:search" color="contrast" placeholder={t("Search users...")}/>
              <div className="mt-4 max-h-[200px] overflow-y-auto mb-5 rounded-lg bg-white dark:bg-muted-950 border border-muted-200 dark:border-muted-800">
                {users.length > 0 ? (users.map((user) => (<div key={user.id} className="flex items-center gap-2 py-2 px-4">
                      <div className="me-2 flex items-center">
                        <Checkbox_1.default color="primary" checked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)} onChange={() => handleSelectUser(user)}/>
                      </div>
                      <Avatar_1.default size="xxs" src={user.avatar || "/img/avatars/placeholder.webp"}/>
                      <div className=" text-muted-700 dark:text-muted-200 flex flex-col">
                        <span className="text-md">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </div>))) : (<div className="py-4 text-center">
                    <react_2.Icon icon="arcticons:samsung-finder" className="mx-auto h-20 w-20 text-muted-400"/>
                    <h3 className="mb-2 font-sans text-xl text-muted-700 dark:text-muted-200">
                      {t("Nothing found")}
                    </h3>
                    <p className="mx-auto max-w-[280px] font-sans text-md text-muted-400">
                      {t("Sorry, looks like we couldn't find any matching records. Try different search terms.")}
                    </p>
                  </div>)}
              </div>
              <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 rounded-lg bg-muted-50 dark:bg-muted-900 border border-muted-200 dark:border-muted-800">
                <Pagination_1.default buttonSize={"md"} currentPage={userPagination.currentPage} totalCount={userPagination.totalItems} pageSize={userPagination.perPage} onPageChange={(page) => setUserPagination({ ...userPagination, currentPage: page })}/>
              </div>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex w-full justify-between gap-2">
              <p className="mt-2 text-md font-medium text-muted-700 dark:text-muted-200">
                {t("Selected Targets")} {selectedUsers.length}
              </p>
              <div className="flex gap-2">
                <Button_1.default variant="outlined" color="primary" shape="smooth" onClick={handleAddAllUsers} disabled={isLoading || items.length === totalUsersInDatabase}>
                  {t("Select All Targets")}
                </Button_1.default>
                <Button_1.default variant="solid" color="primary" shape="smooth" loading={isLoading} disabled={isLoading} onClick={handleAddUsers}>
                  {t("Add")}
                </Button_1.default>
              </div>
            </div>
          </div>
        </Card_1.default>
      </Modal_1.default>
    </Default_1.default>);
};
exports.default = CampaignDetails;
exports.permission = "Access Mailwizard Campaign Management";
