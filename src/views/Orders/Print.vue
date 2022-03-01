<template>
  <div class="order-print-data">
    <table width="100%" border="0">
      <tbody>
        <tr>
          <td colspan="2" width="100%">
            <table width="100%">
              <tbody>
                <tr>
                  <td id="logoСheck" class="logoСheck" width="30%">
                    <h2><a href="https://edaserov.ru">Edaserov.ru</a></h2>
                  </td>
                  <td class="infoShop">
                    <table id="shop_contacts" align="right">
                      <tbody>
                        <tr>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <font face="Arial">Тел.: +7 (922) 131-77-85</font>
                          </td>
                        </tr>
                        <tr>
                          <td><font face="Arial">edaserov.ru</font></td>
                        </tr>
                        <tr>
                          <td><font face="Arial">help@edaserov.ru</font></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <table width="100%" border="0">
              <tbody>
                <tr>
                  <td colspan="2" align="center">
                    <b
                      ><font size="5" face="Arial"
                        >Товарный чек №{{ order._it }}&nbsp;&nbsp;от
                        {{ getTime(order._created) }}</font
                      ></b
                    >
                  </td>
                </tr>
                <tr>
                  <td width="100%" valign="top">
                    <table
                      width="100%"
                      cellspacing="0"
                      bordercolor="#000000"
                      border="1"
                    >
                      <thead>
                        <tr>
                          <td class="line head" width="20" align="center">№</td>
                          <td class="line head" width="80" align="center">
                            &nbsp;Артикул
                          </td>
                          <td class="line head" align="center">
                            &nbsp;Наименование
                          </td>
                          <td class="line head" width="100" align="center">
                            Цена
                          </td>
                          <td class="line head" width="80" align="center">
                            Кол-во
                          </td>
                          <td class="line head" width="100" align="center">
                            Сумма
                          </td>
                        </tr>
                      </thead>
                      <tbody class="cart_items">
                        <tr v-for="(item, index) in order.cart" :key="index">
                          <td class="line" align="right">{{ index + 1 }}</td>
                          <td class="line">&nbsp;</td>
                          <td class="line">
                            {{
                              item.name +
                              (item.select
                                ? ` (${item.select.name} +${$currency(
                                    item.select.price
                                  )})`
                                : "")
                            }}
                          </td>
                          <td class="line" align="right">
                            <span :title="`${item.price} российских рублей`"
                              ><span class="num">{{
                                $currency(item.price)
                              }}</span></span
                            >
                          </td>
                          <td class="line" align="center">
                            {{ item.quantity }}
                          </td>
                          <td class="line nobr" align="right">
                            <span
                              :title="`${
                                item.quantity * item.price
                              } российских рублей`"
                              ><span class="num">{{
                                $currency(getCartItemSubtotal(index))
                              }}</span></span
                            >
                          </td>
                        </tr>

                        <tr>
                          <td class="line" align="right">
                            {{ order.cart.length + 1 }}
                          </td>
                          <td class="line">Доставка&nbsp;</td>
                          <td class="line">
                            {{ deliveryType(order.delivery) }}
                          </td>
                          <td class="line" align="right">
                            <span
                              v-if="order.delivery == 'tohome'"
                              :title="`${$currency(
                                order.delivery_price
                              )} российских рублей`"
                              ><span class="num">{{
                                $currency(order.delivery_price)
                              }}</span></span
                            >

                            <span
                              v-if="order.delivery != 'tohome'"
                              title="0.00 российских рублей"
                              ><span class="num">0.00</span> ₽</span
                            >
                          </td>
                          <td class="line" align="center">1 шт</td>
                          <td class="line nobr" align="right">
                            <span
                              v-if="order.delivery == 'tohome'"
                              :title="`${$currency(
                                order.delivery_price
                              )} российских рублей`"
                              ><span class="num">{{
                                $currency(order.delivery_price)
                              }}</span></span
                            >

                            <span
                              v-if="order.delivery != 'tohome'"
                              title="0.00 российских рублей"
                              ><span class="num">0.00</span> ₽</span
                            >
                          </td>
                        </tr>
                        <tr>
                          <td class="line" align="right">
                            {{ order.cart.length + 2 }}
                          </td>
                          <td class="line">Скидка&nbsp;</td>
                          <td class="line">Накопительная скидка</td>
                          <td class="line" align="right">
                            <span
                              v-if="order.discount"
                              :title="`${
                                order.discount - order.total
                              } российских рублей`"
                              ><span class="num">{{
                                $currency(order.discount - order.total)
                              }}</span></span
                            >

                            <span
                              v-if="!order.discount"
                              title="0.00 российских рублей"
                              ><span class="num">{{ $currency(0) }}</span></span
                            >
                          </td>
                          <td class="line" align="center">
                            {{ order.percent ? order.percent + " %" : "0 %" }}
                          </td>
                          <td class="line nobr" align="right">
                            <span
                              v-if="order.discount"
                              :title="`${
                                order.discount - order.total
                              } российских рублей`"
                              ><span class="num">{{
                                $currency(order.discount - order.total)
                              }}</span></span
                            >

                            <span
                              v-if="!order.discount"
                              title="0.00 российских рублей"
                              ><span class="num">{{ $currency(0) }}</span></span
                            >
                          </td>
                        </tr>

                        <tr>
                          <td class="line" align="right">
                            {{ order.cart.length + 3 }}
                          </td>
                          <td class="line">Фонд&nbsp;</td>
                          <td class="line">Накопительный счет</td>
                          <td class="line"></td>
                          <td class="line"></td>
                          <td class="line" align="right">
                            <span
                              :title="`${Math.round(
                                user.fund
                              )} российских рублей`"
                              ><span class="num">{{
                                $currency(Math.round(user.fund))
                              }}</span></span
                            >
                          </td>
                        </tr>

                        <tr>
                          <td class="line" colspan="5" align="right">
                            <b
                              >Итого<br />
                              Без НДС<br />
                              К оплате</b
                            >
                          </td>
                          <td class="line" align="right">
                            <template v-if="order.delivery == 'tohome'">
                              <b class="nobr">
                                {{
                                  order.discount
                                    ? $currency(
                                        order.discount + order.delivery_price
                                      )
                                    : $currency(
                                        order.total + order.delivery_price
                                      )
                                }}<br /><br />

                                {{
                                  order.discount
                                    ? $currency(
                                        order.discount + order.delivery_price
                                      )
                                    : $currency(
                                        order.total + order.delivery_price
                                      )
                                }}<br />
                              </b>
                            </template>

                            <template v-if="order.delivery != 'tohome'">
                              <b class="nobr">
                                {{
                                  order.discount
                                    ? $currency(order.discount)
                                    : $currency(order.total)
                                }}<br /><br />

                                {{
                                  order.discount
                                    ? $currency(order.discount)
                                    : $currency(order.total)
                                }}<br />
                              </b>
                            </template>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="nonblock" width="100%" border="0">
              <tbody>
                <tr>
                  <td>
                    <font size="3" face="Arial">Покупатель:</font>
                    {{ order.name }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellspacing="0" border="1">
                      <tbody>
                        <tr>
                          <td class="line" width="33.3%">
                            Тел.: {{ phoneFormat(order.phone) }}
                          </td>
                          <td class="line" width="33.3%">
                            <template v-if="order.delivery == 'tohome'">
                              Адрес: {{ "Ул." + order.address.street }}
                              {{ "Дом " + order.address.house }}
                              {{ "Кв. " + order.address.apartment }}
                            </template>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    <table class="tablefoot" width="100%">
                      <tbody>
                        <tr>
                          <td width="50%">
                            <font size="3" face="Arial"
                              >Поставщик ______________________</font
                            >
                          </td>
                          <td width="50%">
                            <font size="3" face="Arial"
                              >Покупатель ______________________</font
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import "dayjs/locale/ru";
dayjs.locale("ru");

import phoneFormatter from "phone-formatter";

export default {
  data: () => ({
    order: "",
    user: "",
  }),
  created() {
    this.order = this.$route.params.order;
    this.checkHaveProduct();
  },
  mounted() {
    // window.print();
    document.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        window.print();
      }
    });
  },
  computed: {
    getSumDiscount() {},
  },
  methods: {
    async checkHaveProduct() {
      const loading = this.$vs.loading();
      await this.$axios
        .get(
          `${process.env.VUE_APP_MAIN_URL}/admin/order/${this.$route.params.id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        )
        .then(
          (res) => {
            console.log(res);
            if (res.data.doc == null) this.notfound = true;
            this.order = res.data.doc;

            this.checkHaveUser(res.data.doc.user);

            loading.close();
          },
          (err) => {
            if (err) this.notfound = true;
          }
        );
    },
    checkHaveUser() {
      this.$axios
        .get(`${process.env.VUE_APP_MAIN_URL}/admin/user/${this.order.user}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
        .then(
          (res) => {
            this.user = res.data.doc;
          },
          (err) => {
            console.log(err);
          }
        );
    },
    getTime(time) {
      return dayjs(time).format("DD.MM.YYYY");
    },
    phoneFormat(phone) {
      return phoneFormatter.format(phone, "+7 (NNN) NNN NN NN");
    },
    getCartItemSubtotal(index) {
      const item = this.order.cart[index];
      let total = 0;

      if (item.select) {
        total +=
          parseInt(item.price) * parseInt(item.quantity) +
          parseInt(item.select.price);
      } else {
        total += parseInt(item.price) * parseInt(item.quantity);
      }

      return total;
    },

    deliveryType(type) {
      if (type == "tohome") {
        return "Доставка на дом";
      } else if (type == "pickup") {
        return "Самовывоз";
      } else if (type == "incafe") {
        return "В кафе";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>