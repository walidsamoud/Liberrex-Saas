export default [{
        url: "/dashboard",
        name: "Dashboards",
        icon: "mdi mdi-view-dashboard",
        i18n: "Menu.Dashboard",
        index: 1,
        authorize: ['*'],
        permission: ['*']
    },
    {
        url: "/queues",
        name: "Queues",
        icon: "mdi mdi-clock-start",
        i18n: "Menu.Queues",
        index: 2.1,
        authorize: ['*'],
        permission: ['queue_allowed']
    },
    {
        url: "/bookings",
        name: "Bookings",
        icon: "mdi mdi-calendar-multiple-check",
        i18n: "Menu.Bookings.Bookings",
        index: 2.2,
        authorize: ['*'],
        permission: ['booking_allowed'],
        child : [{
            url: "/bookings",
            name: "calendar",
            icon: "mdi mdi-calendar",
            i18n: "Menu.Bookings.Calendar",
            index: 6.0,
            authorize: ['*'],
            permission: ['booking_allowed']
        },
        {
            url: "/bookings/table",
            name: "Bookings table view",
            icon: "mdi mdi-table-large",
            i18n: "Menu.Bookings.Table",
            index: 6.1,
            authorize: ['*'],
            permission: ['booking_allowed']
        },
        {
            url: "/bookings/request",
            name: "Bookings request view",
            icon: "mdi mdi-calendar-clock",
            i18n: "Menu.Bookings.Request",
            index: 6.2,
            authorize: ['*'],
            permission: ['booking_require_approval']
        },
        {
            url: "/bookings/availability",
            name: "BookingDays",
            icon: "mdi mdi-calendar-multiple-check",
            i18n: "Menu.Bookings.BookingDays",
            index: 6.3,
            authorize: ['*'],
            permission: ['booking_allowed']
        }

        ]
    },
    {
        url: "/customers",
        name: "Customers",
        icon: "mdi mdi-account-circle",
        i18n: "Menu.Customers",
        index: 2.3,
        authorize: ['ADMIN', 'MANAGER'],
        permission: ['*']
    },
    {
        url: "/kiosks",
        name: "Kiosks",
        icon: "mdi mdi-tablet-ipad",
        i18n: "Menu.Kiosks",
        index: 2.6,
        authorize: ['ADMIN'],
        permission: ['allow_kiosks']
    },
    {
        url: "/displays",
        name: "Displays",
        icon: "mdi mdi-television",
        i18n: "Menu.Displays",
        index: 2.8,
        authorize: ['ADMIN'],
        permission: ['allow_display']
    },
    {
        url: "/feedback",
        name: "Feedback",
        icon: "mdi mdi-star-half",
        i18n: "Menu.Feedback",
        index: 2.4,
        authorize: ['ADMIN', 'MANAGER'],
        permission: ['*']
    },
    {
        url: "/statistics",
        name: "Statistics",
        icon: "mdi mdi-chart-areaspline",
        i18n: "Menu.Statistics",
        index: 2.5,
        authorize: ['ADMIN'],
        permission: ['*']
    },
    /*
    {
        url: "/coupons",
        name: "Coupons",
        icon: "mdi mdi-label",
        i18n: "Menu.Coupons",
        index: 2.6,
        authorize: ['ADMIN', 'MANAGER']
    },
     */
    {
        url: "#",
        name: "Settings",
        icon: "mdi mdi-settings",
        i18n: "Menu.Settings",
        index: 6,
        authorize: ['ADMIN', 'MANAGER'],
        permission: ['*'],
        child: [
            {
                url: "/settings/business",
                name: "Business",
                icon: "mdi mdi-bank",
                i18n: "Menu.SettingsBusiness",
                index: 6.0,
                authorize: ['ADMIN'],
                permission: ['*']
            },
            {
                url: "/settings/holidays",
                name: "Holidays",
                icon: "mdi mdi-calendar-remove",
                i18n: "Menu.Holidays",
                index: 6.05,
                authorize: ['ADMIN'],
                permission: ['*']
            },
            {
                url: "/settings/team",
                name: "Team",
                icon: "mdi mdi-account-multiple",
                i18n: "Menu.SettingsTeam",
                index: 6.1,
                authorize: ['ADMIN', 'MANAGER'],
                permission: ['*']
            },
            {
                url: "/settings/departments",
                name: "Departments",
                icon: "mdi mdi-home",
                i18n: "Menu.SettingsDepartments",
                index: 6.8,
                authorize: ['ADMIN'],
                permission: ['*']
            },
            {
                url: "/settings/services",
                name: "Services",
                icon: "mdi mdi-square-inc",
                i18n: "Menu.SettingsServices",
                index: 6.2,
                authorize: ['ADMIN', 'MANAGER'],
                permission: ['*']
            },
            {
                url: "/settings/rules",
                name: "Rules",
                icon: "mdi mdi-steam",
                i18n: "Menu.SettingsRules",
                index: 6.3,
                authorize: ['ADMIN'],
                permission: ['*']
            },
            {
                url: "/settings/membership",
                name: "Membership",
                icon: "mdi mdi-cart-outline",
                i18n: "Menu.SettingsMembership",
                index: 6.4,
                authorize: ['ADMIN'],
                permission: ['*']
            },
            {
                url: "/settings/billing",
                name: "Billing",
                icon: "mdi mdi-credit-card",
                i18n: "Menu.SettingsBilling",
                index: 6.5,
                authorize: ['ADMIN'],
                permission: ['*']
            },
            {
                url: "/settings/sms",
                name: "Sms",
                icon: "mdi mdi-message-processing",
                i18n: "Menu.SettingsSms",
                index: 6.6,
                authorize: ['ADMIN'],
                permission: ['*']
            },
            {
                url: "/settings/general",
                name: "General",
                icon: "mdi mdi-settings-box",
                i18n: "Menu.SettingsGeneral",
                index: 6.7,
                authorize: ['ADMIN'],
                permission: ['*']
            },
            // {
            //     url: "/settings/payment",
            //     name: "General",
            //     icon: "mdi mdi-cash-multiple",
            //     i18n: "Menu.SettingsPayment",
            //     index: 6.9,
            //     authorize: ['ADMIN']
            // },
            {
                url: "/settings/forms",
                name: "General",
                icon: "mdi mdi-clipboard-text",
                i18n: "Menu.SettingsForms",
                index: 6.11,
                authorize: ['ADMIN'],
                permission: ['*']
            }
        ],
    },
]