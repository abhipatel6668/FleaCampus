import random
import os
import argparse
from faker import Faker
from datetime import datetime, timedelta
from database import insert_user, add_product, add_image, add_image_and_get_id, get_all_products, add_review, add_order
from dotenv import load_dotenv

load_dotenv(".flaskenv")

# Initialize Faker
fake = Faker()

# Categories for the products
categories = ["furniture", "technology", "clothes", "appliances"]

def load_fake_reviews(unique_id_num):
    products = get_all_products()

    #product is a dictionary, keys are product_id, vendor_netid, name, price, catefory, image_id, created_at, image_url
    for product in products:
        product_id =  product.get("product_id")
        for i in range(fake.random_int(min=3, max=5)):
            #create fake buyer
            netID = fake.name().replace(' ', '') + str(unique_id_num)
            email = netID + "@uic.edu"
            insert_user(netID, email)

            add_order(netID, product_id)
            add_review(netID, product_id, (fake.random_int(min=1, max=5)))


def load_fake_sellers():
    unique_id_num = 1
    image_id = 1

    for category in categories:
        filepath = os.path.join("imgURLs", category + ".csv")
        with open(filepath) as f:
            while True:
                line = f.readline()
                
                #end of file
                if not line:
                    break

                product_name = line.split(',')[0] + str(unique_id_num)
                img_url = line.split(',')[1].strip()

                #create fake seller
                netID = fake.name().replace(' ', '') + str(unique_id_num)
                email = netID + "@uic.edu"
                insert_user(netID, email)

                #create fake image and get its id
                image_id = add_image_and_get_id(img_url)

                #create fake product
                add_product(netID, product_name, fake.pricetag().replace('$', '').replace(',', ''), category, image_id)

                unique_id_num += 1

    return unique_id_num

if __name__ == "__main__":
    unique_id = load_fake_sellers()
    load_fake_reviews(unique_id)
