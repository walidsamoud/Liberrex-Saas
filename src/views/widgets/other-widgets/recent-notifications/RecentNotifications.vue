<template>
  <div>
    <div class="mailbox">
      <div
        class="message-center overflow-auto position-relative"
        v-for="notification in notifications"
        :notification="notification"
        :key="notification.notificationtitle"
      >
        <!-- Message -->
        <a
          href="javascript:void(0)"
          class="d-flex align-items-center border-bottom d-block px-3 py-2"
        >
          <vs-button
            radius
            color="primary"
            type="filled"
            :icon="icon(notification.properties.type)"
          ></vs-button>
          <div class="mail-contnet d-inline-block w-75 pl-2 align-middle">
            <h6 class="message-title mt-1">{{ $t('Notifications.Backend.'+notification.properties.type)}}</h6>
            <span
              class="mail-desc d-block text-truncate overflow-hidden text-nowrap text-muted"
            >{{ notification.properties.customer_name }}</span>
            <span
              class="time d-block text-truncate overflow-hidden text-nowrap text-muted"
            >{{ createdAt(notification.created_at) }}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "RecentNotification",
  props: {
    comment: Object,
    notifications: Array
  },
  data: () => ({
    title: "RecentNotification"
  }),
  methods: {
    createdAt (date) {
      return this.$moment(date).fromNow();
    },
    icon(action){
      switch (action) {
        case 'queue_request':
          return 'live_help';
        default:
          return '';
      }
    }
  }
};
</script>