import React, { Component } from "react";
import { Item, Header, Button, Card } from "semantic-ui-react";
import { getMenuItems } from "../modules/menuItemsData.js";
import { createOrder, updateOrder } from "../modules/orderHelper";

class MenuItemList extends Component {
  state = {
    menuData: [],
  };
  componentDidMount() {
    this.getMenuItemsData();
  }

  getMenuItemsData = async () => {
    let result = await getMenuItems();
    this.setState({ menuData: result });
  };

  addToOrder = async (event) => {

    let response;
    let itemId = event.target.dataset.item_id;
    if (this.state.numberOfItems) {
      response = await updateOrder(itemId, this.state.orderId);
    } else {
      response = await createOrder(itemId);
    }
    let numberOfItems = response.order.items.length;
    this.setState({
      message: response.message,
      numberOfItems: numberOfItems,
      orderId: response.order.id,
    });
    this.props.orderId(this.state.orderId)
  };

  render() {
    const { menuData, message, numberOfItems } = this.state;
    const categoryItems = menuData.filter(
      (item) => item.category === this.props.tab
    );
    let dataIndex = categoryItems.map((item, i) => {
      return (
        <Card fluid key={item.id} data-cy="menu-listing">
          <Card.Content
            data-cy={`${this.props.tab.slice(
              0,
              -1
            )}-${categoryItems.indexOf(item)}`}
          >
            <Card.Header data-cy="title">{item.title}</Card.Header>
            <Item.Description data-cy="description">
              {item.description}
            </Item.Description>
            <Item.Description data-cy="size">{item.size}</Item.Description>
            <Item.Extra data-cy="price">{item.price}Kr</Item.Extra>
            <Item.Extra data-cy="size">{item.size}</Item.Extra>
            {this.props.authenticated && (
              <Button fluid
                data-item_id={item.id}
                data-cy={`order-button-${i + 1}`}
                onClick={(event) => this.addToOrder(event)}
              >
                Add to cart
              </Button>
            )}
          </Card.Content>
        </Card>
      );
    });
    return (
      <>
        <Header id='uppercase' as='h1' textAlign='center' data-cy="menu-category-header">{this.props.tab}</Header>
        {message && <p data-cy="item-added-message">{message}</p>}
        {numberOfItems && (
          <p data-cy="item-count">
            You have {numberOfItems} {numberOfItems > 1 ? "items" : "item"} in
            the basket
          </p>
        )}
        <Card.Group>{dataIndex}</Card.Group>
      </>
    );
  }
}

export default MenuItemList;
