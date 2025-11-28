import random
import os
import argparse
from faker import Faker
from datetime import datetime, timedelta
from database import insert_user, add_product, add_image
from dotenv import load_dotenv

load_dotenv(".flaskenv")

# Initialize Faker
fake = Faker()

# Categories for the products
categories = ["furniture", "technology", "clothes", "appliances"]

def load_fake_sellers():
    unique_id_num = 1
    image_id = 1
    num_products = 0

    for category in categories:
        with open(".\\imgURLs\\" + category + ".csv") as f:
            while True:
                line = f.readline()
                
                #end of file
                if not line:
                    break

                product_name = line.split(',')[0] + str(unique_id_num)
                img_url = line.split(',')[1]

                print(product_name, img_url, num_products)

                #create fake seller
                netID = fake.name().replace(' ', '') + str(unique_id_num)
                email = netID + "@uic.edu"
                insert_user(netID, email)

                #create fake image
                add_image(img_url)

                #create fake product
                add_product(netID, product_name, fake.pricetag().replace('$', '').replace(',', ''), "furniture", image_id)

                unique_id_num += 1
                image_id += 1
                num_products += 1

if __name__ == "__main__":
    load_fake_sellers()
