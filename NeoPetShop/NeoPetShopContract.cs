﻿using System;
using System.ComponentModel;
using System.Numerics;
using Neo;
using Neo.SmartContract.Framework;
using Neo.SmartContract.Framework.Services.Neo;
using Neo.SmartContract.Framework.Services.System;

namespace NeoPetShop
{
    //
    // This contract represents a virtual pet adoption center on the Neo blockchain.
    //
    // A variety of pets are available for adoption.  Whenever you adopt a pet, you take
    // responsibility for feeding it frequently!  If you go for too long without feeding
    // your adopted pet, they will run away (and can be adopted by someone else). Going
    // on vacation? Remember to ask somebody else to feed your pet regularly (anybody can
    // feed a pet, not just the owner).
    //
    [DisplayName("djnicholson.NeoPetShopContract")]
    [ManifestExtra("Author", "David Nicholson")]
    [ManifestExtra("Email", "david@djntrading.com")]
    [ManifestExtra("Description", "Facilitates adoption of virtual pets")]
    public class NeoPetShopContract : SmartContract
    {
        // Keys used to index the contract storage:
        const string PET_MAP = "PetOwners";

        const string FEEDING_MAP = "LastFeed";

        const string METADATA_MAP = "Meta";

        const string METADATA_KEY_OWNER = "Owner";

        // How often pets require feeding (in milliseconds)
        const ulong REQUIRED_FEEDING_INTERVAL = 1000 * 60 * 60 * 24; // 1 day

        // The total amount of pets available for adoption
        static readonly BigInteger PET_COUNT = 16;

        // Fires whenever a pet is adopted (providing the pet ID and the address of the new owner)
        [DisplayName("PetAdopted")]
        public static event Action<BigInteger, UInt160> OnPetAdopted;

        // Fires whenever a pet is fed (providing the pet ID and the address of the feeder and
        // the time of the feeding)
        [DisplayName("PetFed")]
        public static event Action<BigInteger, UInt160, ulong> OnPetFed;

        // Adopt a pet. The pet must not currently have an owner (or must have "run away" from
        // the previous owner because of a lack of food).
        public static void AdoptPet(BigInteger petId)
        {
            UInt160 existingOwner = GetPetOwner(petId);
            if (!existingOwner.IsZero)
            {
                throw new Exception("Pet already adopted");
            }

            string petKey = ValidatePetId(petId);
            var petsMap = Storage.CurrentContext.CreateMap(PET_MAP);
            var tx = (Transaction) ExecutionEngine.ScriptContainer;
            petsMap.Put(petKey, tx.Sender);
            OnPetAdopted(petId, tx.Sender);
            Feed (petId);
        }

        // Stores the address of the person who deployed the contract (they become the "shop
        // owner" and will be allowed to upgrade the shop in the future).
        [DisplayName("_deploy")]
        public static void Deploy(object data, bool update)
        {
            if (update)
            {
                return;
            }

            var metadata = Storage.CurrentContext.CreateMap(METADATA_MAP);
            var tx = (Transaction) ExecutionEngine.ScriptContainer;
            metadata.Put(METADATA_KEY_OWNER, tx.Sender);
        }

        // Feeds an adopted pet (can be invoked by anyone, not just the pet's owner).
        public static void Feed(BigInteger petId)
        {
            if (GetPetOwner(petId) == UInt160.Zero)
            {
                throw new Exception("This pet hasn't been adopted yet, or ran away because it was too hungry!");
            }
            string petKey = ValidatePetId(petId);
            var feedingMap = Storage.CurrentContext.CreateMap(FEEDING_MAP);
            var time = Runtime.Time;
            var tx = (Transaction) ExecutionEngine.ScriptContainer;
            feedingMap.Put(petKey, StdLib.Itoa(time));
            OnPetFed(petId, tx.Sender, time);
        }

        // Returns the last time that a pet was fed (in milliseconds).
        public static BigInteger GetLastFeedingTime(BigInteger petId)
        {
            string petKey = ValidatePetId(petId);
            var feedingMap = Storage.CurrentContext.CreateMap(FEEDING_MAP);
            ByteString feedingData = feedingMap.Get(petKey);
            if (feedingData == null)
            {
                return 0;
            }
            return StdLib.Atoi(feedingData);
        }

        // Returns the current adoptive owner of a pet (or Zero if the pet is
        // available for adoption).
        public static UInt160 GetPetOwner(BigInteger petId)
        {
            string petKey = ValidatePetId(petId);
            var petsMap = Storage.CurrentContext.CreateMap(PET_MAP);
            ByteString owner = petsMap.Get(petKey);
            if (owner == null || IsHungry(petId))
            {
                return UInt160.Zero;
            }
            else
            {
                return (UInt160) owner;
            }
        }

        // Returns the address of the shop owner.
        public static UInt160 GetShopOwner()
        {
            var metadataMap = Storage.CurrentContext.CreateMap(METADATA_MAP);
            ByteString owner = metadataMap.Get(METADATA_KEY_OWNER);
            return (owner == null) ? UInt160.Zero : (UInt160) owner;
        }

        // Returns true if it has been so long since a pet has been fed by its adoptive
        // owner that it will run away and be available for adoption by a less
        // forgetful owner!
        public static bool IsHungry(BigInteger petId)
        {
            var lastFeedTime = GetLastFeedingTime(petId);
            var time = Runtime.Time;
            return lastFeedTime + REQUIRED_FEEDING_INTERVAL < time;
        }

        // Upgrades the contract code (can only be invoked by the shop owner).
        public static void Update(ByteString nefFile, string manifest)
        {
            ValidateShopOwner();
            ContractManagement.Update(nefFile, manifest, null);
        }

        // Confirms that a pet ID is valid (and returns a string representation
        // of the ID for use in contract storage).
        private static string ValidatePetId(BigInteger petId)
        {
            if (petId < 0 || petId >= PET_COUNT)
            {
                throw new Exception("Pet does not exist");
            }
            return StdLib.Itoa(petId);
        }

        // Confirms that the current transaction was created by the shop owner.
        private static void ValidateShopOwner()
        {
            var tx = (Transaction) ExecutionEngine.ScriptContainer;
            var owner = GetShopOwner();
            if (!owner.Equals(tx.Sender))
            {
                throw new Exception("Only the shop owner can do this");
            }
        }
    }
}
